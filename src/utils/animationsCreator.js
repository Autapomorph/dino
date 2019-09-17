export default function createAnimations(scene, animationData) {
  animationData.anims.forEach(data => {
    let frames;
    let framesArray;

    if (data.frames.typeOfGeneration === 'generateFrameNames') {
      frames = scene.anims.generateFrameNames(data.frames.key, {
        prefix: data.frames.prefix || '',
        start: data.frames.start || 0,
        end: data.frames.end || 0,
        suffix: data.frames.suffix || '',
        zeroPad: data.frames.zeroPad || 0,
        frames: data.frames.frames || false,
      });
    } else if (data.frames.typeOfGeneration === 'generateFrameNumbers') {
      frames = scene.anims.generateFrameNumbers(data.frames.key, {
        start: data.frames.start || 0,
        end: data.frames.end || -1,
        first: data.frames.first || false,
        frames: data.frames.frames || false,
      });
    } else {
      data.frames.forEach(i => {
        const frame = {
          key: i.key,
          frame: i.frame,
          duration: i.duration || 0,
          visible: i.visible,
        };

        framesArray.push(frame);
      });
    }

    scene.anims.create({
      key: data.key,
      frames: frames || framesArray,
      defaultTextureKey: data.defaultTextureKey || null,
      frameRate: data.frameRate || 24,
      duration: data.duration,
      skipMissedFrames: data.skipMissedFrames || true,
      delay: data.delay || 0,
      repeat: data.repeat || 0,
      repeatDelay: data.repeatDelay || 0,
      yoyo: data.yoyo || false,
      showOnStart: data.showOnStart || false,
      hideOnComplete: data.hideOnComplete || false,
    });
  });
}
