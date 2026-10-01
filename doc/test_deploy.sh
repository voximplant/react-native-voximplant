#!/usr/bin/env bash

HOST='https://newdocadmin.voximplant.internal/api/docs/import?fqdn=references.reactnative-v2'
DEPLOY_PATH="/var/www/testadmin.voximplant.internal/web"

curl -X POST "$HOST" -v --header "Authorization: Bearer $(cat token.txt)" --form 'file=@reactnative-v2.ad.json'
ssh -i ./ssh_key -o "StrictHostKeyChecking=no" ci@192.168.30.253 "cd $DEPLOY_PATH && php yii cache-x/flush-all"
