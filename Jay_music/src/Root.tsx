import React from 'react';
import {Composition} from 'remotion';
import {PaperMV} from './PaperMV';
import {LyricsMV} from './LyricsMV';
import timeline from './timeline.json';
import lyricTimeline from './lyric-timeline.json';

export const Root: React.FC = () => <>
  <Composition id="LyricsMV" component={LyricsMV} durationInFrames={lyricTimeline.durationInFrames} fps={lyricTimeline.fps} width={1920} height={1080}/>
  <Composition id="PaperMV" component={PaperMV} durationInFrames={timeline.durationInFrames} fps={timeline.fps} width={1920} height={1080}/>
</>;
