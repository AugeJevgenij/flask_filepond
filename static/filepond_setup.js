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
    credits: false,
    maxFileSize: "1MB",
    acceptedFileTypes: ["image/png", "image/jpeg"],
    // allowMultiple: true,
    // instantUpload: false,
    fileRenameFunction: (file) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        return `${file.basename}-${year}${month}${day}-${hours}${minutes}${seconds}${file.extension}`;
    },
    server: {
        url: "./",
        process: {
            url: "./process",
            headers: { "X-CSRF-TOKEN": token },
        },
        revert: {
            url: "./revert",
            headers: { "X-CSRF-TOKEN": token },
        },
    },
});

// function test(r) {

//     console.log(r)

//     r = JSON.parse(r);
//     console.log(r)

//     let filename = r.filename[0];
//     console.log(filename)

//     let elem = document.getElementById('static');
//     elem.value += filename;
// }

const filepond = FilePond.create(inputElement);

// get a reference to the root node
const pond = document.querySelector('.filepond--root');

// listen for events
pond.addEventListener('FilePond:processfile', (e) => {
    console.log('File added', e.detail);
})
pond.addEventListener('FilePond:removefile', (e) => {
    console.log('File removed', e.detail);
})


