if (jQuery && typeof jQuery == "function") {
  jQuery(document).ready(function () {

    // Watch for click event at overlay screen
    jQuery(".ui-widget-overlay").live("click", function () {
      jQuery(".noTitle").dialog("close");
    });
    
    jQuery.imgpop = function (opts) {
      var id = opts.id,
          full_image = opts.full_image,
          fw = opts.full_width,
          fh = opts.full_height,
          title = opts.title,
          tw = jQuery(window).width() - 40,
          th = jQuery(window).height() - 40,
          loaded = false,
          image_dialog = "#image-dialog-" + id,
          proxy_div = "#proxy" + id,
          fimgdiv = "#full_image-" + id,
          imgdiv = "#image-" + id;

      // FIXME: firefox has this strange behaviour that it will
      // download image multiple times when you change <img>
      // `src` from javascript. However, this is only happened
      // if the `src` is set to another image (1x1 px transparent
      // png in this case). This workaround will empty `src`
      // attribute before it's changed to the full-size image.
      jQuery.each(jQuery(".image-drag"), function (i, v) {
        v.src = "";
      });

      jQuery(image_dialog).hide();

      jQuery(image_dialog).dialog({
        dialogClass: 'noTitle',
        autoOpen:  false,
        modal:     true,
        resizable: false,
        minWidth:  (fw >= tw) ? tw : fw,
        height:    (fh >= th) ? th : fh,
        "title":   title,
        show:      'scale',
        hide:      'scale'
      });
      
      // calculate proxy size for draggable containment
      var dw = (fw < tw) ? 0 : (fw - tw),
      dh = (fh < th) ? 0 : (fh - th),
      w = jQuery(image_dialog).dialog("option", "minWidth") + dw * 2,
      h = jQuery(image_dialog).dialog("option", "height") + dh * 2;
      jQuery(proxy_div).width(w);
      jQuery(proxy_div).height(h);

      // put proxy at the center of viewport
      var l = 0 - dw, t = 0 - dh;
      jQuery(proxy_div).css('left', l + 'px');
      jQuery(proxy_div).css('top', t + 'px');

      // put image at this specific position,
      // so th top-left area of the image is showed.
      jQuery(fimgdiv).css('left', dw + 'px');
      jQuery(fimgdiv).css('top', dh + 'px');

      // Make image draggable
      jQuery(fimgdiv).draggable({
        containment: 'parent',
        cursor: "move",
        scroll: false
      });

      jQuery(imgdiv).click(function() {
        jQuery(image_dialog).dialog('open');
        if (!loaded) { // poorman's caching system.
          jQuery(fimgdiv)[0].src=full_image;
          loaded = true;
        }
        return false;
      });

      jQuery(fimgdiv).click(function () {
        jQuery(image_dialog).dialog('close');
      });
    }
  });
}

