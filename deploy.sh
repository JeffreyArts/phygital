#! /bin/sh
set -e
export LC_CTYPE=en_US.UTF-8
export LANG=en_US.UTF-8

echo > deploy.log

start_log() {
  start_time=$(date +%s)
  printf "$1\n"
}

end_log() {
  end_time=$(date +%s)
  duration=$((end_time - start_time))
  minutes=$((duration / 60))
  seconds=$((duration % 60))
  printf "$1 in %02d:%02d\n" "$minutes" "$seconds" 
  echo ""
}

skip_build=false
skip_zip=false
skip_upload=false
skip_deploy=false
skip_cleanup=false

# Function to display the available options
print_options() {
    echo "Possible options for --skip are:"
    echo "- build"
    echo "- zip"
    echo "- upload"
    echo "- deploy"
    echo "- cleanup"
}

# Parsing the command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"

    case $key in
        --skip)
            shift
            while [[ -n $1 && ! $1 =~ ^- ]]; do
                case $1 in
                    build)
                        skip_build=true
                        ;;
                    zip)
                        skip_zip=true
                        ;;
                    upload)
                        skip_upload=true
                        ;;
                    deploy)
                        skip_deploy=true
                        ;;
                    cleanup)
                        skip_cleanup=true
                        ;;
                    *)
                        echo "Invalid skip option: $1"
                        print_options
                        exit 1
                        ;;
                esac
                shift
            done
            ;;
        *)
            echo "Unknown option: $key"
            exit 1
            ;;
    esac
done


# Define Environment variable
if [ -z "$1" ]; then
  ENVIRONMENT_VAR=$NODE_ENV
  echo -e "\033[33mNo environment selected explicitly, using NODE_ENV:$NODE_ENV\033[0m"
else
  ENVIRONMENT_VAR=$1
fi

if [ "$ENVIRONMENT_VAR" = "production" ]; then
  export NODE_ENV=production
  ENV_FILE=".env.production"
elif [ "$ENVIRONMENT_VAR" = "staging" ]; then
  export NODE_ENV=staging
  ENV_FILE=".env.staging"
else
  echo "Unknown environment: $ENVIRONMENT_VAR"
  exit 1
fi

# Load the environment variables from .env.production
set -o allexport
source "$ENV_FILE"
set +o allexport


# Set MAX BACKUPS to 8 when not set
: ${MAX_BACKUPS:=8}

# Validate environment variables
missing_var_flag=0
{

  if [ -z "${DEPLOYMENT_HOST-}" ]; then
    echo "Missing DEPLOYMENT_HOST variable <user>@<host>"
    missing_var_flag=1
  fi

  if [ -z "${DEPLOYMENT_USER-}" ]; then
    echo "Missing DEPLOYMENT_USER variable <user>@<host>"
    missing_var_flag=1
  fi
  if [ -z "${DEPLOYMENT_PATH-}" ]; then
    echo "DEPLOYMENT_PATH variable is missing. Set to target location server (ex. /var/www/web/<project>)" 
    missing_var_flag=1
  fi

}>> deploy.log 2>&1

# Quit deploy script when required variables are not set
if [ $missing_var_flag -eq 1 ]; then
  start_log "❌ Not all required variables provided, for more info see: https://github.com/JeffreyArts/server/wiki/Vite-website-setup" 
  exit 1
fi

start_log "🪄  Starting deployment [$(date +%H:%M:%S)]"
echo ""

  ##############################
 # 👷‍♂️ Build the application 👷‍♂️ #
###############################
if [ "$skip_build" = false ]; then
start_log "👷‍♂️ Building project"
{
  yarn build
} 2>&1 | tee -a deploy.log

# Check the exit status of the last command
if [ "${PIPESTATUS[0]}" -ne 0 ]; then
  echo "Error: yarn build failed."
  exit 1
fi

end_log "👷‍♂️ Project build"
fi



  ##################
 # 🤐 Zip files 🤐 #
##################
if [ "$skip_zip" = false ]; then
start_log "🤐 Zipping project"
{
  zip -r deploy.zip dist
} >> deploy.log 2>&1
end_log "🤐 Project zipped"
fi


  #####################
 # 💽 Upload files 💽 #
#####################
# Check if the deployment path exists and create it if it does not
if [ "$skip_upload" = false ]; then
start_log "💽 Uploading deploy.zip to $DEPLOYMENT_HOST:$DEPLOYMENT_PATH/deploy.zip" 
{

  # Check if directory exist and create if not
  ssh "$DEPLOYMENT_USER@$DEPLOYMENT_HOST" "test -d $DEPLOYMENT_PATH || mkdir -p $DEPLOYMENT_PATH"
  
  # Copy zip from local machine to server
  scp deploy.zip $DEPLOYMENT_USER@$DEPLOYMENT_HOST:$DEPLOYMENT_PATH/deploy.zip
} >> deploy.log 2>&1  
end_log "💽 Deploy.zip uploaded" 
fi




  #######################
 # 🖥️ Deploy website 🖥️ #
#######################
# Unzip the zip file and copy the contents to the appropriate location on the remote server
if [ "$skip_deploy" = false ]; then
  start_log "🖥️  Deploying website" 
  {
    # Check if the `/current` directory exists and backup if it does
    if ssh $DEPLOYMENT_USER@$DEPLOYMENT_HOST test -d "$DEPLOYMENT_PATH/current"; then
        timestamp=$(date +%Y%m%d-%H%M%S)
        ssh $DEPLOYMENT_USER@$DEPLOYMENT_HOST "cp -r $DEPLOYMENT_PATH/current $DEPLOYMENT_PATH/bk_$timestamp; \
        chown -R $DEPLOYMENT_USER:web $DEPLOYMENT_PATH/bk_$timestamp; \
        "
    fi

    # Unzip deploy.zip to `/tmp` directory and move the contents over to the `/current` directory
    ssh $DEPLOYMENT_USER@$DEPLOYMENT_HOST "\
        unzip $DEPLOYMENT_PATH/deploy.zip -d $DEPLOYMENT_PATH/tmp; 
        rm $DEPLOYMENT_PATH/current -rf; \
        mv $DEPLOYMENT_PATH/tmp/dist $DEPLOYMENT_PATH/current; \
        chown -R $DEPLOYMENT_USER:web $DEPLOYMENT_PATH/current; \
        rm $DEPLOYMENT_PATH/tmp -rf; \
        exit"
  } >> deploy.log 2>&1
        
  end_log "🖥️  Website deployed" 
fi



  ##########################
 # 🗑️ Cleanup old files 🗑️ #
##########################
# Clean up old files
if [ "$skip_cleanup" = false ]; then
start_log "🗑️ Cleanup back-ups" 
{

if ssh $DEPLOYMENT_USER@$DEPLOYMENT_HOST test -d "$DEPLOYMENT_PATH"; then
    # Clean up old backups if there are more than X
    num_backups=$(ssh "$DEPLOYMENT_USER@$DEPLOYMENT_HOST" "find '$DEPLOYMENT_PATH' -maxdepth 1 -type d -name 'bk_*' | wc -l")
    echo "Number of active backups: $num_backups"
    
    if [ "$num_backups" -gt "$MAX_BACKUPS" ]; then
        excess_backups_array=()

        while IFS= read -r backup; do
            excess_backups_array+=("$backup")
        done < <(ssh "$DEPLOYMENT_USER@$DEPLOYMENT_HOST" "find '$DEPLOYMENT_PATH/' -name 'bk_*' -type d | head -n -$MAX_BACKUPS")

        # Iterate over the array
        for backup in "${excess_backups_array[@]}"; do
            ssh "$DEPLOYMENT_USER@$DEPLOYMENT_HOST" "rm -rf '$backup' 2>&1"

            if [ $? -ne 0 ]; then
                echo "❌ Failed to remove '$backup' on remote host"
            else
                echo "✅ Removed '$backup' from remote host"
            fi
        done < <(printf '%s\0' "$excess_backups")

    fi
    num_backups=$(ssh "$DEPLOYMENT_USER@$DEPLOYMENT_HOST" "find '$DEPLOYMENT_PATH' -maxdepth 1 -type d -name 'bk_*' | wc -l")
    echo "Number of active backups: $num_backups"
fi

# Remove the remote zip file
if [ "$skip_zip" = false ]; then
 ssh $DEPLOYMENT_USER@$DEPLOYMENT_HOST "\
    rm $DEPLOYMENT_PATH/deploy.zip;\
    exit"
    
  echo "remove $DEPLOYMENT_PATH/deploy.zip"
fi

# Remove the local zip file
if [ "$skip_zip" = false ]; then
  rm deploy.zip
  echo "remove local /deploy.zip"
fi
} 2>&1 | tee -a deploy.log

end_log "🗑️ Back-ups cleaned" 
fi


echo ""
echo "🎉 Deployment complete! [$(date +%H:%M:%S)]"
