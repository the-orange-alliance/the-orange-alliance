interface StreamingChatProps {
  channel?: string;
}

const StreamingChat: React.FC<StreamingChatProps> = ({ channel }) => {
  return (
    <iframe
      style={{ width: '100%', height: '100%' }}
      frameBorder="0"
      scrolling="no"
      src={`https://www.twitch.tv/embed/${
        channel || 'theorangealliance1'
      }/chat?darkpopout&parent=theorangealliance.org&parent=localhost`}
    />
  );
};

export default StreamingChat;
