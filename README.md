# ironatlas

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your end-to-end tests

```
npm run test:e2e
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Get sample data URL

EN:
http://ironatlas.medline.ch/ajxDt.php?apprcss=ironaltas&crd=3,0,0,0,0,0
DE:
http://ironatlas.medline.ch/ajxDt.php?apprcss=ironaltas&crd=4,0,0,0,0,0
FR:
http://ironatlas.medline.ch/ajxDt.php?apprcss=ironaltas&crd=10,0,0,0,0,0
ES:
http://ironatlas.medline.ch/ajxDt.php?apprcss=ironaltas&crd=9,0,0,0,0,0

## How to communicate with animation player

For integration instructions, look at the html file.
I think it is pretty straight forward.

Here are all the possible preview values:
none
all
absorption
transport
usage
loss
recycling
storage
regulation

Here are all the animations ids:
navigation //Excluded from step by step playlist, and from previous/next navigation
absorption1
absorption2
transport1
usage1
usage2
usage3
usage4
loss1
recycling1
storage1
regulation1 //Excluded from step by step playlist, but not from the previous/next navigation
regulation2
regulation3

## TODO

3. Destroy player method - Drop this ands use Interrupt and resume
   1. It resumes wher it was left
4. What about the background music - Maybe lower a little bit later...
5. Tooltips in all languages for utility elements
6. Regulation
   1. Issue with tour mode
   2. Zommed mode to be considered in "Regulation" landing
7. Do we need to support progressbar draging? - Not supported...for now
8.  Implement routing with history mode
9.  Implement Google Analytics - crosschannel Web - and Appstore
    1.  Provide credentials to Albert
10. With the existing implementation playing after the last step is lost - Gaetan
11. Do we need to control sound separately (bg music and speaker) - No need
12. Better handling language switch when is speaking - Alban
13. Autoplay issue - https://blog.videojs.com/autoplay-best-practices-with-video-js/ - Ask user to respond...(introduce a resume button, maybe rfom the homepage to feel familiar) - Alban
14. Minimap behaviour on mobile...should not show automatically - Albert
15. Swipe navigation... - Pending release from the Animation - Gaetan
16. Align step markers with progressbar - Use the callback info animationReadyCallback - Alban
17. Animation seems to brake under a strssed navigation - what should we do. - (window.iron3d.setShowControlsCallback( ( showTop, showBottom )) - Alban
18. Recheck screenshot - its broken - Alban
19. Better styling of legal sections links in the footer - Albert
20. Review Microsite - Alban

