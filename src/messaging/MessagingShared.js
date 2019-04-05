/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';

export default class MessagingShared {
     static _instance = null;
     currentUser = null;

     constructor() {
         if (MessagingShared._instance) {
             throw new Error('Error - use MessagingSharing.getInstance()');
         }
     }

     static getInstance() {
         if (MessagingShared._instance === null) {
             MessagingShared._instance = new MessagingShared();
         }
         return MessagingShared._instance;
     }

     setCurrentUser(user) {
         if (user === null) {
             this.currentUser = null;
         } else {
             let userParts = user.split('@');
             userParts[1] = userParts[1].split('.').splice(0, 2).join('.');
             this.currentUser = userParts.join('@');
         }
     }

     getCurrentUser() {
         return this.currentUser;
     }

}