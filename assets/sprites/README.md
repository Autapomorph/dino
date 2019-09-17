# Bird fly animation spites adjustment

Due to unequal dimensions of bird fly animation sprites you should adjust `sourceSize` and `spriteSourceSize` for `bird-1` and `bird-2` inside `dino-atlas.json` as follows:

```json
{
  "filename": "bird-1",
  "rotated": false,
  "trimmed": true,
  "sourceSize": {
    "w": 92,
    "h": 68
  },
  "spriteSourceSize": {
    "x": 0,
    "y": 12,
    "w": 92,
    "h": 68
  },
  "frame": {
    "x": 1473,
    "y": 27,
    "w": 92,
    "h": 68
  }
}
```

```json
{
  "filename": "bird-2",
  "rotated": false,
  "trimmed": true,
  "sourceSize": {
    "w": 92,
    "h": 68
  },
  "spriteSourceSize": {
    "x": 0,
    "y": 0,
    "w": 92,
    "h": 60
  },
  "frame": {
    "x": 1881,
    "y": 27,
    "w": 92,
    "h": 60
  }
}
```
