// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

import PromptInput from "@cloudscape-design/components/prompt-input";
import Avatar from "@cloudscape-design/chat-components/avatar";
import { CodeView } from "@cloudscape-design/code-view";
import CopyToClipboard from "@cloudscape-design/components/copy-to-clipboard";
// import Textarea from "@cloudscape-design/components/textarea";
// import { v4 as uuidv4 } from "uuid";

import {
  useChatInteract,
  useChatMessages,
  IStep,
  useChatData,
} from "@chainlit/react-client";
import { useState } from "react";
import { Box } from "@cloudscape-design/components";
import { LoadingBar } from "@cloudscape-design/chat-components";
import ReactMarkdown from 'react-markdown';


export function Playground() {
  const [inputValue, setInputValue] = useState("");
  const { sendMessage } = useChatInteract();
  const { messages } = useChatMessages();
  const { loading } = useChatData()
  // const [loading, setIsloading] = useState(false);

  console.log(loading)

  const handleSendMessage = () => {
    // setIsloading(true);
    const content = inputValue.trim();
    if (content) {
      const message = {
        name: "user",
        type: "user_message" as const,
        output: content,
      };
      sendMessage(message, []);
      setInputValue("");
    }
  };

  const renderMessage = (message: IStep) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(message.createdAt).toLocaleTimeString(
      undefined,
      dateOptions
    );

    const parts = message.output.split(/(```json[\s\S]*?```)/g);

    return (
      <div key={message.id} className="flex items-start space-x-2">
        <div className="w-20 text-sm text-green-500">
          {message.name === "Tirith-Copilot" ? (
            <Avatar ariaLabel="Avatar of generative AI assistant" color="gen-ai" iconName="gen-ai" tooltipText="Tirith-Copilot" />
          ) : (
            <Avatar ariaLabel={`Avatar of ${message.name}`} tooltipText={message.name} />
          )}
        </div>
        <div className="flex-1 flex-col border rounded-lg p-2">
          <div>
            {parts.map((part, index) => {
              // Check if part is a JSON code block
              if (part.startsWith("```json")) {
                const jsonCode = part.replace(/```json|\n```/g, ""); // Remove the ```json and ``` markers
                return (
                  <div key={index} style={{ margin: "20px 0" }}>
                    <CodeView
                      content={jsonCode}
                      lineNumbers
                      actions={
                        <CopyToClipboard
                          copyButtonAriaLabel="Copy code"
                          copyErrorText="Code failed to copy"
                          copySuccessText="Code copied"
                          textToCopy={jsonCode}
                        />
                      }
                    />
                  </div>
                );
              }
              // Render the markdown text parts

              return <ReactMarkdown key={index}>{part}</ReactMarkdown>;
            })}
          </div>
          <small className="text-xs text-gray-500">{date}</small>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {messages.map((message) => renderMessage(message))}
          {loading &&
            <div aria-live="polite" className="ml-24">
              <Box
                // margin={{ bottom: "xs", left: "l" }}
                color="text-body-secondary"
              >
                Generating a response
              </Box>
              <LoadingBar variant="gen-ai" />
            </div>}
        </div>
      </div>
      <div className="border-t p-4 bg-white dark:bg-gray-800 w-full ">
        {/* <div className="flex items-center space-x-2"> */}
        <PromptInput

          onChange={({ detail }) => setInputValue(detail.value)}
          value={inputValue}
          actionButtonAriaLabel="Send message"
          actionButtonIconName="send"
          ariaLabel="Prompt input with action button"
          placeholder="Ask a question"
          onAction={() => handleSendMessage()}
          autoFocus
          minRows={5}
        />


        {/* </div> */}
      </div>
    </div>
  );
}
