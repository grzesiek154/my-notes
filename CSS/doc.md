# Display property

https://css-tricks.com/almanac/properties/d/display/

https://developer.mozilla.org/en-US/docs/Web/CSS/display

Every element on a web page is a rectangular box. The display property in CSS determines just how that rectangular box behaves. There are only a handful of values that are commonly used:

```css
div {
  display: inline;        /* Default of all elements, unless UA stylesheet overrides */
  display: inline-block;  /* Characteristics of block, but sits on a line */
  display: block;         /* UA stylesheet makes things like <div> and <section> block */
  display: run-in;        /* Not particularly well supported or common */
  display: none;          /* Hide */
}
```

The default value for all elements is inline. Most “User Agent Stylesheets” (the default styles the browser applies to all sites) reset many elements to “block”. Let’s go through each of these, and then cover some of the other less common values.

#### Inline

The default value for elements. Think of elements like `<span>`, `<em>`, or `<b>` and how wrapping text in those elements within a string of text doesn’t break the flow of the text.

![inline-element](https://i0.wp.com/css-tricks.com/wp-content/uploads/2011/09/inline-element.png?resize=346%2C108)
The `<em>` element has a 1px red border. Notice it sits right *inline* with the rest of the text.

An inline element will accept margin and padding, but the element still sits inline as you might expect. Margin and padding will only push other elements horizontally away, not vertically.

![inlinepadding](https://i1.wp.com/css-tricks.com/wp-content/uploads/2011/09/inlinepadding.png?resize=519%2C148)

An inline element will not accept [`height`](https://css-tricks.com/almanac/properties/h/height/) and [`width`](https://css-tricks.com/almanac/properties/w/width/). It will just ignore it.

#### Inline Block

An element set to `inline-block` is very similar to inline in that it will set inline with the natural flow of text (on the “baseline”). The difference is that you are able to set a `width` and `height` which will be respected.

![inline-block](https://i0.wp.com/css-tricks.com/wp-content/uploads/2011/09/inline-block.png?resize=526%2C207)

#### Block

A number of elements are set to `block` by the browser UA stylesheet. They are usually container elements, like `<div>`, `<section>`, and `<ul>`. Also text “blocks” like `<p>` and `<h1>`. Block level elements do not sit inline but break past them. By default (without setting a width) they take up as much horizontal space as they can.

![block](https://i2.wp.com/css-tricks.com/wp-content/uploads/2011/09/block.png?resize=520%2C239)The two elements with the red borders are `<p>`s which are block level elements. The `<em>` element in between them doesn’t sit inline because the blocks break down below inline elements.

#### Run-in

First, this property doesn’t work in Firefox. Word is that the spec for it isn’t well defined enough. To begin to understand it though, it’s like if you want a header element to sit inline with the text below it. Floating it won’t work and [neither will anything else](https://css-tricks.com/run-in/), as you don’t want the header to be a child of the text element below it, you want it to be its own independent element. In “supporting” browsers, it’s like this:

![Run-in](https://i1.wp.com/css-tricks.com/wp-content/uploads/2011/09/Run-in.png?resize=294%2C97)Don’t count on it, though.

#### Flexbox

The `display` property is also used for new fangled layout methods like Flexbox.

```css
.header {
  display: flex;
}
```

There are some older versions of flexbox syntax, so please [consult this article](https://css-tricks.com/using-flexbox/) for the syntax in using flexbox with the best browser support. Be sure to see this [complete guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/).

#### Flow-Root

The `flow-root` display value creates a new “block formatting context”, but is otherwise like `block`. A new BFC helps with things like clearing floats, removing the need for [hacks](https://css-tricks.com/snippets/css/clear-fix/) to do that.

```css
.group {
  display: flow-root;
}
```

This browser support data is from [Caniuse](https://caniuse.com/#feat=flow-root), which has more detail. A number indicates that browser supports the feature at that version and up.

#### Desktop

| Chrome | Firefox | IE   | Edge | Safari |
| :----- | :------ | :--- | :--- | :----- |
| 58     | 53      | No   | 79   | 13     |

#### Mobile / Tablet

| Android Chrome | Android Firefox | Android | iOS Safari |
| :------------- | :-------------- | :------ | :--------- |
| 90             | 87              | 90      | 13.0-13.1  |

### Grid

Grid layout will also be initially set by the display property.

```css
body {
  display: grid;
}
```

Here’s [our guide on Grid layout](https://css-tricks.com/snippets/css/complete-guide-grid/), which includes a browser support chart.

#### None

Entirely removes the element from the page. Note that while the element is still in the DOM, it is removed visually and any other conceivable way (you can’t tab to it or its children, it is ignored by screen readers, etc).

### Table Values

There is a whole set of display values that force non-table elements to behave like table elements, if you need that to happen. It’s rare-ish, but it sometimes allows you to be “more semantic” with your code while utilizing the unique positioning powers of tables.

```
div {
  display: table;
  display: table-cell;
  display: table-column;
  display: table-colgroup;
  display: table-header-group;
  display: table-row-group;
  display: table-footer-group;
  display: table-row;
  display: table-caption;
}
```

To use, just mimic normal table structure. Simple example:

```html
<div style="display: table;">
  <div style="display: table-row;">
    <div style="display: table-cell;">
      Gross but sometimes useful.
    </div>
  </div>
</div>
```

### More Information

- [MDN](https://developer.mozilla.org/en/CSS/display)



# CSS units

Recommendations of unit types per media type:

| Media  | Recommended | Occasional use     | Infrequent use             | Not recommended        |
| ------ | ----------- | ------------------ | -------------------------- | ---------------------- |
| Screen | em, rem, %  | px                 | ch, ex, vw, vh, vmin, vmax | cm, mm, in, pt, pc     |
| Print  | em, rem, %  | cm, mm, in, pt, pc | ch, ex                     | px, vw, vh, vmin, vmax |

## Relative units

[Relative units](http://www.w3.org/TR/css3-values/#font-relative-lengths) play nicely with both screen and print media types and should be the most frequently used CSS units.

| Unit                                              | Description                                                  |
| ------------------------------------------------- | ------------------------------------------------------------ |
| %                                                 | percentage, relative to the same property of the parent element |
| [em](http://www.w3.org/TR/css3-values/#em-unit)   | relative to font size of the element                         |
| [rem](http://www.w3.org/TR/css3-values/#rem-unit) | relative to font size of the root element                    |
| [ch](http://www.w3.org/TR/css3-values/#ch-unit)   | relative to width of the "0" (ZERO, U+0030) glyph in the element's font |
| [ex](http://www.w3.org/TR/css3-values/#ex-unit)   | relative to x-height of the font                             |

## Absolute units

Physical units (e.g. cm, mm, in, pc, and pt) should only be used for print style sheets, while pixels (px) should only be used for the screen. While there are consistent conversions among all of these [absolute length units](http://www.w3.org/TR/css3-values/#absolute-lengths), [depending on the device, CSS units can actually mean different things](http://omnicognate.wordpress.com/2013/01/07/in-css-px-is-not-an-angular-measurement-and-it-is-not-non-linear/). For example, while `1cm` in CSS should print as one physical centimeter, there's no guarantee that `1cm` in CSS results in one physical centimeter on the screen.

| Unit | Description | cm       | mm       | in       | pc       | pt      | px      |
| ---- | ----------- | -------- | -------- | -------- | -------- | ------- | ------- |
| cm   | centimeter  | `1cm`    | `10mm`   |          |          |         |         |
| mm   | millimeter  | `1/10cm` | `1mm`    |          |          |         |         |
| in   | inch        | `2.54cm` | `25.4mm` | `1in`    | `6pc`    | `72pt`  | `96px`  |
| pc   | pica        |          |          | `1/6in`  | `1pc`    | `12pt`  | `16px`  |
| pt   | point       |          |          | `1/72in` | `1/12pc` | `1pt`   | `4/3px` |
| px   | pixel       |          |          | `1/96in` | `1/16pc` | `3/4pt` | `1px`   |

## Viewport units

[Viewport-percentage length units](http://www.w3.org/TR/css3-values/#viewport-relative-lengths) should be used with caution, as there is still some [lingering bugs with their implementation](http://caniuse.com/#feat=viewport-units).

| Unit                                                | Description                                    |
| --------------------------------------------------- | ---------------------------------------------- |
| [vw](http://www.w3.org/TR/css3-values/#vw-unit)     | relative to 1% of viewport's width             |
| [vh](http://www.w3.org/TR/css3-values/#vh-unit)     | relative to 1% of viewport's height            |
| [vmin](http://www.w3.org/TR/css3-values/#vmin-unit) | relative to 1% of viewport's smaller dimension |
| [vmax](http://www.w3.org/TR/css3-values/#vmax-unit) | relative to 1% of viewport's larger dimension  |

# Contexts

## Document-level

Assume the root font size is `16px` but don't require it to be so. Either declare the font size as `100%` or don't declare the `font-size` property at all.

```css
html {
  font-size: 100%;
}
```

## Borders

Most likely use `px`, as most of the time, the border shouldn't need to scale.

```css
.Component {
  border-bottom: 1px solid #ccc;
}
```

## Font-size

Font-size should only be applied at the lowest possible child elements, in order to minimize its cascading impact on relative units. While both of the following two examples are essentially equivalent, only the first is recommended.

**DO**:

```css
.Component {
}
.Component-heading {
  font-size: 1.2em;
}
.Component-body {
  font-size: 0.9em;
}
```

**DO NOT**

```css
.Component {
  font-size: 1.2em;
}
.Component-heading {
  font-size: 1em;
}
.Component-body {
  font-size: 0.75em;
}
```

## Padding and margin

In order to ensure consistent use of whitespace throughout the application, given a component could be used in a variety of contexts, it may be best to use `rem` for margin and padding than `em`.

```css
.Component {
  margin: 1rem 0;
  padding: 1rem;
}
```

## Media queries

[Only use `em` within media query definitions, never pixels](http://blog.cloudfour.com/the-ems-have-it-proportional-media-queries-ftw/). Until there's wider [`rem` support within media queries](http://fvsch.com/code/bugs/rem-mediaquery/), [`rem` should be avoided in media queries as well](http://codeboxers.com/em-vs-px-vs-rem-in-media-queries/).

```css
@media (min-width: 20em) {
  .Component {
    background-color: blue;
  }
}
```