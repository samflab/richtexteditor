# **Rich Text Editor Documentation**

## **Introduction**
This document provides a comprehensive overview of the architecture, state management approach, and accessibility considerations for a custom-rich text editor built to support text formatting, inline components, custom block elements, undo/redo functionality, a robust clipboard system, and a mention system with preview cards. The editor integrates text editing features with interactive elements to provide a polished user experience.

---

## **1. Architecture Decisions**

### **1.1 Component Structure**
The editor is divided into several components, each responsible for managing specific features of the rich text editor. These include:

- **Editor**: The main container component that holds the content-editable area and integrates with all other functionality.
- **Toolbar**: A separate component that houses the controls for text formatting, inline components, mentions, lists, etc.
- **Inline Components**: Custom components such as quotes, code blocks, and callouts that users can insert and manipulate within the text.
- **Undo/Redo System**: A custom hook that manages the undo and redo functionality, preserving the editor's state.
- **Mention System**: A system to handle @mentions with fuzzy search across data sources.
- **Clipboard System**: A robust clipboard handling system to ensure proper formatting during copy-paste operations and content transformations.
- **State Management**: The entire application's state is managed in a centralized manner, ensuring smooth communication between components.

### **1.2 Key Libraries and Tools**
- **React**: For building the UI components and managing the overall state of the application.
- **ContentEditable**: A native HTML element used to create a rich text input area.
- **useState & useEffect**: React hooks for managing state and lifecycle events.
- **useRef**: Used to track the editor and inline components' references.
- **Redux** (optional): For more complex state management across large parts of the app.
- **Fuzzy Search**: A custom search solution for the @mention system to support fuzzy matching across data sources.

### **1.3 Customization and Styling**
- **CSS-in-JS**: Used for dynamic styling based on editor state (such as active formatting and highlighted text).
- **CSS Grid/Flexbox**: For the layout of the toolbar and the content area, ensuring responsiveness and scalability.
- **SVG Icons**: Custom icons for interactive elements like block quotes, code blocks, etc.

---

## **2. State Management Approach**

### **2.1 Centralized State**
- **Editor State**: All user content is stored as HTML or JSON in the state, which is managed in the `Editor` component using `useState` or a more complex state management solution like Redux for scalability.
- **Action States**: Specific states are tracked for text formatting (bold, italic, underline), selections, cursor position, and undo/redo history.
- **Undo/Redo State**: Each action that modifies the content (like typing or formatting) is pushed into an undo stack. Redo actions are handled by storing the current state in a redo stack when an undo operation occurs.

### **2.2 State Flow**
- **Editor Component**: The main content editing area manages the cursor position, selection, and interaction with the content (e.g., handling custom blocks and inline elements).
- **Toolbar Component**: Updates the `Editor` state based on user input. For example, when the user clicks "bold," the `Editor` component updates the relevant content using text formatting commands.
- **Inline Component State**: Inline components (like mentions, links, or embedded elements) are handled as separate units, each with its own state and interaction logic, preventing disruption to surrounding text.

### **2.3 Managing Interactive Elements**
- **Drag-and-Drop**: Inline elements are movable within the editor, with the content flow automatically adjusted to maintain the layout. This is done using drag-and-drop handlers that modify the component's position and update the editor's state accordingly.

### **2.4 Keyboard Shortcuts**
- **Key Events**: Key events like `Cmd+Shift+8` for lists, `Cmd+B` for bold, and `Tab` for indentation are mapped to specific actions in the editor state. These events are handled via `onKeyDown` listeners on the `contentEditable` element.

---

## **3. Accessibility Considerations**

### **3.1 Keyboard Navigation**
- **Focus Management**: Interactive elements (such as buttons for formatting or dragging blocks) are focusable, ensuring users can navigate through them using the keyboard. The `tabindex` attribute is used to make elements focusable.
- **Arrow Key Navigation**: Users can navigate through interactive blocks (such as lists, mentions, and custom components) using arrow keys, and the selection follows the cursor without breaking the text flow.
- **Access to Formatting Controls**: Each text formatting button (bold, italic, etc.) has a descriptive `aria-label` to ensure that screen readers can interpret its functionality.

### **3.2 Screen Reader Support**
- **Proper ARIA Roles**: The toolbar buttons and interactive elements are given `aria-labels` and appropriate roles to ensure that they are understandable by screen readers.
  - For example, the toolbar buttons for formatting text (`bold`, `italic`, etc.) will have an `aria-label="Bold"` to indicate their function.

### **3.3 Custom Block Elements**
- **Accessible Blocks**: Custom block elements like quotes and code blocks are implemented with semantic HTML (e.g., `<blockquote>` and `<pre>`) and are properly tagged for screen readers. Each block element has an appropriate `aria-label` to clarify its content type.

### **3.4 Mentions Accessibility**
- **Mention System**: When a user types `@`, a dropdown with fuzzy search results appears. This dropdown is fully navigable with the keyboard (up/down arrows) and screen reader accessible.
  - The mention preview card displays additional information about the mentioned entity in a way that is readable and understandable by screen readers.

### **3.5 Color Contrast and Font Accessibility**
- **High Contrast**: Text formatting features and toolbar buttons are designed with sufficient color contrast for accessibility. Colors are chosen to comply with WCAG 2.1 guidelines for accessible design.
- **Font Sizes**: A range of font sizes is supported, allowing users to adjust text size to improve readability.

---

## **4. Key Functional Features**

### **4.1 Text Formatting**
- **Bold, Italic, Underline, and Headings**: These are handled through simple button interactions in the toolbar, updating the selection style using contenteditable's `document.execCommand` or `Range` API.
- **Nested Lists**: Support for nested lists with custom indentation behavior is managed by adjusting the list's styling and handling the "Tab" and "Shift+Tab" keyboard shortcuts.

### **4.2 Inline Component System**
- **Highlight and Update**: Users can highlight text and update it with a dropdown for adding links, mentions, or other interactive elements.
- **Custom Block Elements**: Blocks like quotes and code blocks are inserted and can be modified independently, allowing text flow to remain intact.

### **4.3 Undo/Redo**
- **State Grouping**: Complex content transformations (e.g., adding inline elements, text formatting) are grouped into single undoable actions.
- **Preserving Selection**: The cursor and selection state is preserved across undo/redo operations, ensuring users do not lose their place in the content.

### **4.4 Mention System**
- **Fuzzy Search**: The mention system supports fuzzy search across multiple data sources (e.g., user database) to find mentions that match the user’s input.
- **Preview Cards**: When a mention is selected, a preview card displays additional information about the entity, providing more context to the user before finalizing the mention.

---

## **5. Conclusion**
The custom rich text editor is built with a strong focus on interactivity, accessibility, and a seamless user experience. State management is centralized for easy maintenance, and all interactive features are designed to be keyboard-navigable and screen-reader friendly. Custom formatting, inline components, and undo/redo functionality ensure a powerful and flexible writing tool suitable for diverse content creation needs.
