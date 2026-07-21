import ConversationWorkspace from "../../../components/common/ConversationWorkspace";
import { receptionConversations } from "../data/communications";

function ReceptionChatPanel() {
  return (
    <main className="rc-inbox-page" aria-label="Reception inbox">
      <ConversationWorkspace
        className="rc-inline-chat"
        threads={receptionConversations}
        conversationLabel="Inbox"
        subtitle="Patient communication · Online"
        receivedMessage="Thank you for the update. The reception desk will be ready for you shortly."
        sentMessage="Your message has been received. We will keep you updated."
      />
    </main>
  );
}

export default ReceptionChatPanel;
