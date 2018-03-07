Google Maps - AngularJS Directive
=================================

Easy to use Google Maps `AngularJS Directive`

Both addresses and latitude / longitude are supported as addresses.

All options you have within the Google Maps API are available through the `data` attributes.

**Examples:**  

*   data-zoom="5"
*   data-clickable-icons="false"
*   data-styles="\[YOUR CUSTOM JSON STYLE\]"
*   data-fullscreen-control="false"

For a full list of options with explenation, please visit the official google API site: [https://developers.google.com/maps/documentation/javascript/reference/3/#MapOptions](https://developers.google.com/maps/documentation/javascript/reference/3/#MapOptions)

Installation
------------

Copy and paste the directive into your project.

Include the module

```javascript
angular.module('myApp', \['GoogleMaps'\])
```

Place this somewhere in your `html`

```html
<google-maps 
    data-addresses="dalwagenseweg 60a" 
    data-zoom="14">
<⁄google-maps>
```

You also have to set this `css`

```css
google-maps {
  display: block;
  min-height: 250px; // If no height / min-height isset, the map won't be visible.
}
```

Using an address
----------------

You can specify a marker using an address, eg:  
`data-markers="Prunesstraat 3 opheusden"`

[https://codepen.io/richardmauritz/pen/jYPBde]
(https://codepen.io/richardmauritz/pen/jYPBde)

Using latitude / longitude
--------------------------

Separate the lat / long value with a whitespace. You can specify a marker using latitude / longitude like so:  
`data-markers="51.927742 5.636626" // which translates to Dalwagenseweg 60a opheusden`.

[https://codepen.io/richardmauritz/pen/jYPBde]
(https://codepen.io/richardmauritz/pen/jYPBde)

Multiple addresses
------------------

You can add multiple markers, separate them using `;`, eg:  
`data-markers="Prunesstraat 3 opheusden"`

The map will automaticly center itself so all the markers are visible. To disable this feature, see example below

[https://codepen.io/richardmauritz/pen/jYPBde]
(https://codepen.io/richardmauritz/pen/jYPBde)

Disable automatic centering
---------------------------

You can disable the automatic centering of the map using  `data-center="false"`. If disabled the map will not focus on the first address given in the `data-addresses` attribute.

[https://codepen.io/richardmauritz/pen/jYPBde]
(https://codepen.io/richardmauritz/pen/jYPBde)

Disable centering and set focus point
-------------------------------------

You can specify a focus point by giving the index. You can only use `data-focus-on` if `data-center` is set to false. The first address is set as `0` the second address as `1`, and so on.  Eg: `data-focus-on="2"` change it to `1`, or `0`, and see what happens.

[https://codepen.io/richardmauritz/pen/jYPBde]
(https://codepen.io/richardmauritz/pen/jYPBde)
