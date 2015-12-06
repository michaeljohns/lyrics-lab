$(document).ready(function() {
  $('.image-set').each(function() {
    var $set = $(this);
    var $full = $set.find('.image-set-full');
    var $thumbs = $set.find('.image-set-thumbnails').children('.thumbnail');

    if (!$thumbs.length) {
      $thumbs = $set.find('.image-set-list').children('.image-set-item');
    }

    var $empty = $('<div/>')
                  .appendTo($full)
                  .addClass('image-set-full-content')
                  .addClass('empty')
                  .text('Select an image above for a larger view.');

    //$full.append($empty);

    $thumbs.each(function(i, el) {
      var $thumb = $(this);

      $thumb.on('click', function() {
        if ($empty) {
          $empty.remove();
        }

        var src = $thumb.data('src');
        $thumbs.removeClass('active');
        $thumb.addClass('active');

        // Fade out old
        var $old = $full.find('.image-set-full-content').remove();

        // Fade in new
        var $new = $('<div/>')
                    .addClass('image-set-full-content')
                    .css('background-image', 'url(' + src + ')')
                    .appendTo($full);

        // Attempt to wait for another rendering pass so fade-in transition works.
        setTimeout(function(argument) {
          $new.addClass('in');
        }, 10);
      });
    });
  });
});
