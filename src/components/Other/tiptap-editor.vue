<template>
  <div class="tiptap-editor">
    <div v-if="editor" class="tiptap-editor__header">
      <div class="tiptap-editor__header-inner">
        <icon-button
          :size="0.7"
          icon="bold"
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
        >
        </icon-button>
        <icon-button
          :size="0.7"
          icon="italic"
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
        </icon-button>
        <!-- <icon-button
        :size="0.7"
        icon="strikethrough"
        :class="{ 'is-active': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
      </icon-button>
      <icon-button
        :size="0.7"
        icon="code-view"
        :class="{ 'is-active': editor.isActive('code') }"
        @click="editor.chain().focus().toggleCode().run()"
      >
      </icon-button> -->
        <icon-button
          :size="0.7"
          icon="format-clear"
          @click="editor.chain().focus().unsetAllMarks().run()"
        >
        </icon-button>
        <icon-button
          :size="0.7"
          icon="filter-off-line"
          @click="editor.chain().focus().clearNodes().run()"
        >
        </icon-button>
        <icon-button
          :size="0.7"
          icon="paragraph"
          :class="{ 'is-active': editor.isActive('paragraph') }"
          @click="editor.chain().focus().setParagraph().run()"
        >
        </icon-button>
        <!-- <icon-button
        :size="0.7"
        icon="h-1"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
      </icon-button>
      <icon-button
        :size="0.7"
        icon="h-2"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
      </icon-button>
      <icon-button
        :size="0.7"
        icon="h-3"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
      </icon-button>
      <icon-button
        :size="0.7"
        icon="h-4"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
      >
      </icon-button>
      <icon-button
        :size="0.7"
        icon="h-5"
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
      >
      </icon-button>
      <icon-button
        :size="0.7"
        icon="h-6"
        :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
      >
      </icon-button>
      <icon-button
        :size="0.7"
        icon="list-unordered"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
      </icon-button>
      <icon-button
        :size="0.7"
        icon="list-ordered"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
      </icon-button>
      <icon-button
        :size="0.7"
        icon="code-box-line"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
      </icon-button>
      <icon-button
        :size="0.7"
        icon="double-quotes-l"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      > 
      </icon-button> -->
        <icon-button
          :size="0.7"
          icon="separator"
          @click="editor.chain().focus().setHorizontalRule().run()"
        >
        </icon-button>
        <icon-button
          :size="0.7"
          icon="text-wrap"
          @click="editor.chain().focus().setHardBreak().run()"
        >
        </icon-button>
        <icon-button
          :size="0.7"
          icon="arrow-go-back-line"
          @click="editor.chain().focus().undo().run()"
        ></icon-button>
        <icon-button
          :size="0.7"
          icon="arrow-go-forward-line"
          @click="editor.chain().focus().redo().run()"
        ></icon-button>
      </div>
    </div>
    <editor-content :editor="editor" />
    <div class="tiptap-editor__footer">
      <div v-if="editor" class="tiptap-editor__footer--character-count">
        {{ editor.storage.characterCount.characters() }}/{{ limit }} characters
        ({{ editor.storage.characterCount.words() }} words)
      </div>
    </div>
  </div>
</template>

<script setup>
import { Editor, EditorContent } from '@tiptap/vue-3';
import { onBeforeUnmount } from 'vue';
// import StarterKit from '@tiptap/starter-kit';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Blockquote from '@tiptap/extension-blockquote';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import History from '@tiptap/extension-history';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';

const props = defineProps({
  limit: {
    type: Number,
    required: false,
    default: 500,
  },
  placeholder: {
    type: String,
    required: false,
    default: 'Write something...',
  },
});
const editor = new Editor({
  editorProps: {
    attributes: {
      class: 'tiptap-editor__content',
    },
  },
  extensions: [
    Paragraph,
    Text,
    Blockquote,
    Document,
    HardBreak,
    HorizontalRule,
    Bold,
    Italic,
    CharacterCount.configure({
      limit: props.limit,
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    Dropcursor,
    Gapcursor,
    History,
  ],
  // content: `
  //       <h2>
  //         Hi there,
  //       </h2>
  //       <p>
  //         this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
  //       </p>
  //     `,
  injectCSS: false,
});

onBeforeUnmount(() => {
  editor.destroy();
});
</script>
