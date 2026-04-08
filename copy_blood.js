const fs = require('fs');
try {
    fs.copyFileSync(
        'c:\\Users\\imrag\\OneDrive\\Desktop\\Blood Donation\\src\\public\\blood.png',
        'c:\\Users\\imrag\\OneDrive\\Desktop\\Blood Donation\\public\\blood.png'
    );
    console.log('Success');
} catch (e) {
    console.error(e);
}
