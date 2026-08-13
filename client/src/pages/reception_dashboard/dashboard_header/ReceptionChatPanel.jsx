import ChatWorkspace from "../../../components/common/chat/ChatWorkspace";

function ReceptionChatPanel() {
  return (
    <main className="rc-inbox-page" aria-label="Reception inbox">
      <ChatWorkspace role="receptionist" />
    </main>
  );
}

export default ReceptionChatPanel;
