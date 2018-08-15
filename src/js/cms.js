import React from "react";
import CMS from "netlify-cms";

import HomePreview from "./cms-preview-templates/home";
import PostPreview from "./cms-preview-templates/post";
import ProductsPreview from "./cms-preview-templates/products";
import ValuesPreview from "./cms-preview-templates/values";
import ContactPreview from "./cms-preview-templates/contact";


// Example of creating a custom color widget
class ColorControl extends React.Component {
  render() {
    return <input
        style={{height: "80px"}}
        type="color"
        value={this.props.value}
        onInput={(e) => this.props.onChange(e.target.value)}
    />;
  }
}




CMS.registerPreviewStyle("/css/main.css");
CMS.registerPreviewTemplate("home", HomePreview);
CMS.registerPreviewTemplate("post", PostPreview);
CMS.registerPreviewTemplate("products", ProductsPreview);
CMS.registerPreviewTemplate("values", ValuesPreview);
CMS.registerPreviewTemplate("contact", ContactPreview);
CMS.registerWidget("color", ColorControl);


CMS.registerEditorComponent({
  // Internal id of the component
  id: "figure",
  // Visible label
  label: "Figure",
  // Fields the user need to fill out when adding an instance of the component
  fields: [
      {name: 'src', label: 'Image', widget: 'image'},
      {name: 'caption', label: 'Caption', widget: 'string'},
      {name: 'width', label: 'Width (px)', widget: 'string'},
      {name: 'height', label: 'Height (px)', widget: 'string'}
    ],
  // Pattern to identify a block as being an instance of this component
  pattern: /^{{<\s*figure (?:(src|caption|width|height)="([^"]*)")*\s*(?:(src|caption|width|height)="([^"]*)")*\s* (?:(src|caption|width|height)="([^"]*)")*\s* (?:(src|caption|width|height)="([^"]*)")*\s*>}}$/,
  // Function to extract data elements from the regexp match
  fromBlock: function(match) {

    var src = "";
    var caption = "";
    var width = "";
    var height = "";

    console.log(match);

    for(var i = 1; i < match.length; i+=2) {
      if (match[i] !== undefined) {
        if (match[i].indexOf("src") !== -1) {
          src = match[i+1];
        } else if (match[i].indexOf("caption") !== -1) {
          caption = match[i+1];
        } else if (match[i].indexOf("width") !== -1) {
          if (!isNaN(match[i+1])) {
            width = match[i+1];
          }
        } else if (match[i].indexOf("height") !== -1) {
          if (!isNaN(match[i+1])) {
            height = match[i+1];
          }
        }
      }
    }

    return {
      src: src,
      caption: caption,
      width: width,
      height: height,
    };
  },
  // Function to create a text block from an instance of this component
  toBlock: function(obj) {
    return '{{< figure src="' + obj.src + '" w="' + obj.width + '" h="' + obj.height + '" caption="' + obj.caption + '">}}';
  },
  // Preview output for this component. Can either be a string or a React component
  // (component gives better render performance)
  toPreview: function(obj) {

    var output = "";

    if (obj.link.length > 0) {
      output = 
        '<img src="' + obj.src + '" width="' + obj.width + '"/>'
      ;
    } else {
      output = 
        '<img src="' + obj.src + '" width="' + obj.width + '"/>'
      ;
    }        

    if (obj.caption.length > 0) {
      output += '<br> <i style="font-size: 0.7em">'+ obj.caption +'</i>';
    }

    return ( output );
  }
});