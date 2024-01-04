#! /bin/sh

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
source .env.production
set +o allexport

# Build the application
yarn run build

# Remove the playground-assets directory
rm -r dist/playground-assets

# Zip the dist directory
zip -r deploy.zip dist

# Check if the deployment path exists and create it if it does not
ssh $DEPLOYMENT_USER@$DEPLOYMENT_HOST "test -d $DEPLOYMENT_PATH || mkdir -p $DEPLOYMENT_PATH"

# Upload the zip file to the remote server
scp deploy.zip $DEPLOYMENT_USER@$DEPLOYMENT_HOST:$DEPLOYMENT_PATH/deploy.zip

# Check if the current directory exists and backup if it does
if ssh $DEPLOYMENT_USER@$DEPLOYMENT_HOST test -d "$DEPLOYMENT_PATH/current"; then
    timestamp=$(date +%Y%m%d-%H%M%S)
    ssh $DEPLOYMENT_USER@$DEPLOYMENT_HOST "mv $DEPLOYMENT_PATH/current $DEPLOYMENT_PATH/bk_$timestamp"
fi

# Unzip the zip file and copy the contents to the appropriate location on the remote server
ssh $DEPLOYMENT_USER@$DEPLOYMENT_HOST "\
    unzip $DEPLOYMENT_PATH/deploy.zip -d $DEPLOYMENT_PATH/tmp; 
    mv $DEPLOYMENT_PATH/tmp/dist $DEPLOYMENT_PATH/current; \
    chown -R $DEPLOYMENT_USER:web $DEPLOYMENT_PATH/current; \
    rm $DEPLOYMENT_PATH/tmp -rf; \
    rm $DEPLOYMENT_PATH/deploy.zip; \
    $DEPLOYMENT_PATH/deploy.zip; \
    exit"
    
# Clean up old backups if there are more than 5
if ssh $DEPLOYMENT_USER@$DEPLOYMENT_HOST test -d "$DEPLOYMENT_PATH"; then
    num_backups=$(ssh $DEPLOYMENT_USER@$DEPLOYMENT_HOST "ls -d $DEPLOYMENT_PATH/bk_* | wc -l")
    if [ $num_backups -gt $MAX_BACKUPS ]; then
        ssh $DEPLOYMENT_USER@$DEPLOYMENT_HOST "find $DEPLOYMENT_PATH/ -name "bk_*" -type d -print0 | head -zn -$MAX_BACKUPS | xargs -0 rm -rf"
    fi
fi
# Remove the local zip file
rm deploy.zip