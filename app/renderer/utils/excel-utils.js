import excel from 'excel4node';
import moment from 'moment-jalaali';

const columns = [
  'عنوان',
  'متن پست',
  'آخرین به روز رسانی نسبت به زمان حال',
  'زمان احتمالی نوشته شدن پست',
  'وضعیت انتشار پست',
];

function writeHeaderColumns(worksheet, style) {
  const now = moment();

  worksheet.cell(1, 1).string('تاریخ پشتیبان گیری').style(style);
  worksheet.cell(1, 2).string(now.format('jYYYY/jM/jD')).style(style);

  columns.forEach((title, index) => {
    worksheet.cell(3, index + 1).string(title).style(style);
  });
  return worksheet;
}

export const buildExcel = (data, filePath) => {
  const workbook = new excel.Workbook({
    author: 'virgooldoon'
  });
  
  let worksheet = workbook.addWorksheet('پست های ویرگول', {
    pageSetup: {
      PaperSize: 9, // it's A4
    },
    sheetView: {
      rightToLeft: true,
    },
  });

  const style = workbook.createStyle({
    font: {
      size: 14
    }
  });

  worksheet = writeHeaderColumns(worksheet, style);
  
  data.forEach((post, index) => {
    worksheet.cell(4 + index, 1).string(post.title).style(style);
    worksheet.cell(4 + index, 2).string(post.body).style(style);
    worksheet.cell(4 + index, 3).string(post.updated_at).style(style);
    worksheet.cell(4 + index, 4).string(post.updated_at_moment).style(style);
    worksheet.cell(4 + index, 5).string(post.status).style(style);
  });

  workbook.write(filePath);
};