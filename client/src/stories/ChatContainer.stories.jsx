// src/stories/ChatContainer.stories.jsx
import React from "react";
import ChatContainer from "../components/ChatContainer";

// Default export: REQUIRED
export default {
  title: "Components/ChatContainer", // folder name in Storybook sidebar
  component: ChatContainer,
};

// Named exports: these are your actual stories
export const Default = {
  args: {
    messages: ["Hello!", "How are you?", "Welcome to the chat!"],
  },
};

export const Empty = {
  args: {
    messages: [],
  },
};
