import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import VideoPlayer, {type VideoPlayerRef} from 'react-native-video-player';

interface videoProps {
  visible?: boolean;
  onBackClicked: () => void;
  url?: string;
}

const Video = ({visible, onBackClicked, url}: videoProps) => {
  const playerRef = useRef<VideoPlayerRef>(null);

  return (
    <Modal
      statusBarTranslucent={true}
      isVisible={visible}
      style={styles.modal}
      onBackdropPress={onBackClicked}
      presentationStyle="overFullScreen">
      <VideoPlayer
        ref={playerRef}
        endWithThumbnail
        source={{
          uri: `${url}`,
          // ',
        }}
        showDuration={true}
        hideControlsOnStart={true}
        customStyles={{
          playButton: {borderRadius: 10},
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // This is important to ensure the modal takes up the full screen
  },
});

export default Video;
