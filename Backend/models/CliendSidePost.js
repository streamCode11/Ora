const postFormSchema = {
     fields: [
       {
         name: 'media',
         type: 'file',
         accept: 'image/*',
         multiple: false,
         maxSize: 50 * 1024 * 1024,
         required: true,
       },
       {
         name: 'caption',
         type: 'textarea',
         maxLength: 2200,
         placeholder: 'Write a caption...',
         optional: true,
         emojiPicker: true
       },
       {
         name: 'advancedSettings',
         type: 'section',
         fields: [
           {
             name: 'hideLikes',
             type: 'toggle',
             label: 'Hide like count',
             defaultValue: false
           },
           {
             name: 'turnOffComments',
             type: 'toggle',
             label: 'Turn off commenting',
             defaultValue: false
           },
           {
             name: 'shareToFeed',
             type: 'toggle',
             label: 'Also share to feed',
             defaultValue: true
           }
         ]
       }
     ],
     validation: {
       media: {
         required: true,
         validate: (files) => {
           if (files.length === 0) return false;
           const file = files[0];
           const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
           return validTypes.includes(file.type);
         },
         message: 'Please upload a valid image or video file'
       },
       caption: {
         maxLength: 2200,
         message: 'Caption cannot exceed 2200 characters'
       }
     }
   };