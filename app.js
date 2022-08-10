document.addEventListener('DOMContentLoaded', () => getCat());

const random = (n) => {
    return parseInt(Math.random() * (n + 1));
}

function setCanvas(src, text) {
    console.time('start')

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
        let fontsize = 12;
        let lineheight = 15;

        canvas.width = img.width;
        canvas.height = img.height;

        document.getElementById('loader').style.display = 'none';

        ctx.drawImage(img, 0, 0)

        ctx.lineWidth = 5;
        ctx.font = `${fontsize}pt sans-serif`;
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'gold';
        ctx.textAlign = 'center';
        ctx.lineJoin = 'round';
        ctx.textBaseline = "middle";

        var topline = wrappedText(ctx, text[0], canvas.width);

        var i = 1;
        topline.forEach(item => {
            var pad = i++ * (lineheight + 5);
            ctx.strokeText(item, canvas.width / 2, pad);
            ctx.fillText(item, canvas.width / 2, pad);
        })

        var bottomline = wrappedText(ctx, text[1], canvas.width);

        var i = bottomline.length;
        bottomline.forEach(item => {
            var pad = i-- * (lineheight + 5);
            ctx.strokeText(item, canvas.width / 2, canvas.height - pad);
            ctx.fillText(item, canvas.width / 2, canvas.height - pad);
        })
        const imgsrc = canvas.toDataURL('image/png');
        download(imgsrc, "cat.jpg");
    }
    img.src = src;
}

function wrappedText(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    var text = 'MeasureText'.split(''), len = 0;
    for (var i in text)
        len += ctx.measureText(text[i]).width;
    len /= text.length;

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = (currentLine + " " + word).length * len;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

async function getCat() {
    const catUrl = await fetchCatApi();
    const text = await getLines();

    toDataURL(catUrl, (dataUrl) => {
        setCanvas(dataUrl, text);
    })
}

async function fetchCatApi() {
    let url = 'https://cataas.com';
    return fetch(url + '/cat?&height=300&json=true')
        .then(response => response.json())
        .then(data => {
            return url + data.url;
        })
}

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function download(dataurl, filename) {
    const link = document.createElement("a");
    link.id = 'downloadbtn';
    link.href = dataurl;
    link.download = filename;
    link.innerHTML = '[click here to download]';
    document.body.appendChild(link);
    console.timeEnd('start')
}

async function getLines() {
    let text = await fetchPoemApi();
    let firstline = '',
        secondline = '';
    while (firstline.length < 6 || secondline.length < 6) {
        let r1 = parseInt(Math.random() * (text.length + 1));
        if (text[r1] == undefined) continue;

        let r2 = parseInt(Math.random() * text[r1].linecount);
        if (text[r1].lines[r2 + 1] == undefined ||
            text[r1].lines[r2] == undefined) continue;

        firstline = text[r1].lines[r2].trim();
        secondline = text[r1].lines[r2 + 1].trim();
    }
    return [firstline, secondline]
}

async function fetchPoemApi() {
    let url = 'https://poetrydb.org/author/Walt%20Whitman';
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return data;
        })
}