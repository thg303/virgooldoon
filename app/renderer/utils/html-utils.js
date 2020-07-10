import fs from 'fs-extra';
import path from 'path';

const indexTemplate = `<html>
<head>
    <meta charset="utf-8">
    <title>Virgooldoon Backup</title>
    <link href="https://cdn.rawgit.com/rastikerdar/vazir-font/v18.0.1/dist/font-face.css" rel="stylesheet" type="text/css"/>
    <style>
        * {
            font-family: 'Vazir', sans-serif;
        }
        html, body {
            margin: 0;
            padding: 0;
        }
        .container{
            direction: rtl;
            margin:  20px;
        }
        h1 {
            font-size: 50px;
            margin-bottom: 17px;
            color: #333;
        }
        h2 {
            font-size: 24px;
            line-height: 1.6;
            margin: 30px 0 0 0;
            margin-bottom: 18px;
            margin-top: 33px;
            color: #333;
        }
        h3 {
            font-size: 30px;
            margin: 10px 0 20px 0;
            color: #333;
        }
        header {
            width: 640px;
            margin: auto;
        }
        section {
            width: 640px;
            margin: auto;
        }
        section p {
            margin-bottom: 27px;
            font-size: 20px;
            line-height: 1.6;
            color: #333;
        }
        section img {
            max-width: 640px;
        }
        footer {
            padding: 0 20px;
            margin: 50px 0;
            text-align: center;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <article class="container">
        <header>
            <h1 class="p-name">پست‌های ذخیره شده با ویرگولدون</h1>
        </header>
        <section class="e-content">
           <ul>
            __POST_LINKS__
           </ul>
        </section>

                </article>        
</body>
</html>`;

const template = `<html>
<head>
    <meta charset="utf-8">
    <title>_POST_TITLE_</title>
    <link href="https://cdn.rawgit.com/rastikerdar/vazir-font/v18.0.1/dist/font-face.css" rel="stylesheet" type="text/css"/>
    <style>
        * {
            font-family: 'Vazir', sans-serif;
        }
        html, body {
            margin: 0;
            padding: 0;
        }
        .container{
            direction: rtl;
            margin:  20px;
        }
        h1 {
            font-size: 50px;
            margin-bottom: 17px;
            color: #333;
        }
        h2 {
            font-size: 24px;
            line-height: 1.6;
            margin: 30px 0 0 0;
            margin-bottom: 18px;
            margin-top: 33px;
            color: #333;
        }
        h3 {
            font-size: 30px;
            margin: 10px 0 20px 0;
            color: #333;
        }
        header {
            width: 640px;
            margin: auto;
        }
        section {
            width: 640px;
            margin: auto;
        }
        section p {
            margin-bottom: 27px;
            font-size: 20px;
            line-height: 1.6;
            color: #333;
        }
        section img {
            max-width: 640px;
        }
        footer {
            padding: 0 20px;
            margin: 50px 0;
            text-align: center;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <article class="container">
        <header>
            <h1 class="p-name">_POST_TITLE_</h1>
        </header>
        <section class="e-content">
            _POST_BODY_
        </section>

                </article>        
</body>
</html>`;



export function buildHtml(directory, post) {
  const html = template.replace(/_POST_TITLE_/g, post.title).replace('_POST_BODY_', post.body);
  const postTitle = post.title ? post.title.replace(/[ /\\:]/g, '_') + '__' : 'پیش نویس بدون نام__';
  const filePath = path.join(directory, postTitle + post.updated_at_moment.replace(/\//g, '-') + '.html');
  fs.ensureFileSync(filePath);
  return fs.promises.writeFile(filePath, html, 'utf-8');
}

export async function buildIndexHtmlFile(filePath, htmlDirectory) {
  const files = await fs.readdir(htmlDirectory);
  const html_prefix = path.basename(path.resolve(filePath), '.html');
  const postLinksHtml = files.map(htmlFile => `<li><a href="./${html_prefix}_htmls/${htmlFile}">${path.basename(htmlFile, '.html')}</a></li>`);
  const html = indexTemplate.replace('__POST_LINKS__', postLinksHtml.join("\n"));
  fs.ensureFileSync(filePath);
  return fs.promises.writeFile(filePath, html, 'utf-8');
}