import moment from 'moment-jalaali';

export function normalizer(data) {
  return data.map( post => ({
    title: post.title,
    body: post.body,
    updated_at: post.updated_at,
    updated_at_moment: moment(post.updated_at_moment).format('jYYYY/jM/jD'),
    status: post.post_id === null ? 'پیش‌نویس' : 'منتشر شده',
  }));
}