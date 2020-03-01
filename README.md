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

1. Check again mapping of codes
2. Implement language in router
3. Apply all labels for all languages
4. Check how to handle history mode routing in the server
5. Finalize Screenshot behaviour (how to include existing canvas)
    1. Consider elements which are shown only in screenshot like references and the copyright mesage
6. Implement CLICK sound
7. Guided Tour
8. What about minimap
9. Content
    1. Tables style should be corrected
    2. References style should be rechecked
10. References issue with the links
11. Who controls the text that is shown on the animation (LABELS)
12. Step by step mode
    1. Support jump mode (prev-next)?
    2. Do we need to have a stypebystep mode entered callback?
    3. Check all animations mapping
    4. Better handling of autoplay mode, case when switching scenarios
