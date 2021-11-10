

FilePond.registerPlugin(
    FilePondPluginFileValidateSize,
    FilePondPluginImagePreview,
    FilePondPluginFileRename,
    FilePondPluginFileValidateType
);

inputElement = document.querySelector(".filepond");
token = document
    .querySelector('input[name="csrf_token"]')
    .getAttribute("value");

FilePond.setOptions({
    maxFileSize: "4MB",
    acceptedFileTypes: ["image/png", "image/jpeg"],
    // allowMultiple: true,
    // instantUpload: false,
    fileRenameFunction: (file) => {
        const randomNumber = Math.floor(Math.random() * 9999) + 1;
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();
        // const hours = today.getHours();
        // const minutes = today.getMinutes();
        // const seconds = today.getSeconds();
        // const milliseconds = today.getMilliseconds();
        // return `${file.basename}-${year}${month}${day}-${hours}${minutes}${seconds}${file.extension}`;
        return `IMG-${year}${month}${day}-${randomNumber}${file.extension}`;
    },
    server: {
        headers: { "X-CSRF-TOKEN": token },

        process: "./process",
        revert: "./revert",
        load: {
            url: "../",
        }
    },
});

const filename_field = document.getElementById("static");
let files;

if (filename_field.value !== 'default.png') {
    const myArray = filename_field.value.split(" ");
    files = createFilesArr(myArray);
} else {
    files = '';
}

const filepond = FilePond.create(inputElement, {
    files: files
});


function createFilesArr(files) {

    //     files: [
    //         {
    //             source: 'static/images/kkt-2021108-14181.png',
    //             options: {
    //                 type: 'local'
    //             }
    //         }]

    let arr = [];
    for (const file of files) {
        let a = {};
        a.type = 'local';

        let b = {};
        b.source = 'static/images/' + file;
        b.options = a;
        arr.push(b);
    }
    return arr
}


// get a reference to the root node
const pond = document.querySelector('.filepond--root');

// const filename_field = document.getElementById("static");
const defaultPNG = 'default.png';
const space = ' ';

// listen for events
pond.addEventListener('FilePond:processfile', (e) => {
    if (filename_field.value === defaultPNG) {
        filename_field.value = e.detail.file.filename;
    }
    else {
        filename_field.value = filename_field.value.concat(space);
        filename_field.value = filename_field.value.concat(e.detail.file.filename);
    }
})

pond.addEventListener('FilePond:removefile', (e) => {
    if (filename_field.value.includes(e.detail.file.filename)) {
        filename_field.value = filename_field.value.replace(e.detail.file.filename, '');
        filename_field.value = filename_field.value.replace(/\s+/g, ' ').trim();
    }
    if (filename_field.value === '') {
        filename_field.value = defaultPNG;
    }
    console.log('removed')
    console.log(e.detail)
})