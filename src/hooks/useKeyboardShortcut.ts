import { useEffect, useCallback } from 'react';

interface KeyboardShortcutOptions {
  targetKey: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export const useKeyboardShortcut = (
  callback: () => void,
  options: KeyboardShortcutOptions,
  deps: React.DependencyList = []
) => {
  const {
    targetKey,
    ctrlKey = false,
    shiftKey = false,
    altKey = false,
    metaKey = false,
    preventDefault = true,
    stopPropagation = false
  } = options;

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const {
        key,
        ctrlKey: eventCtrlKey,
        shiftKey: eventShiftKey,
        altKey: eventAltKey,
        metaKey: eventMetaKey
      } = event;

      // 检查是否匹配快捷键组合
      const keyMatch = key.toLowerCase() === targetKey.toLowerCase();
      const modifierMatch = 
        ctrlKey === eventCtrlKey &&
        shiftKey === eventShiftKey &&
        altKey === eventAltKey &&
        metaKey === eventMetaKey;

      if (keyMatch && modifierMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        callback();
      }
    },
    [callback, targetKey, ctrlKey, shiftKey, altKey, metaKey, preventDefault, stopPropagation]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // 重新注册事件监听器当依赖项改变时
  useEffect(() => {
    // 这个 effect 会在 deps 改变时重新运行
  }, deps);
};

// 常用快捷键预设
export const commonShortcuts = {
  search: { targetKey: 'k', ctrlKey: true, metaKey: true }, // Ctrl+K / Cmd+K
  escape: { targetKey: 'Escape' },
  enter: { targetKey: 'Enter' },
  save: { targetKey: 's', ctrlKey: true, metaKey: true }, // Ctrl+S / Cmd+S
  newTab: { targetKey: 't', ctrlKey: true, metaKey: true }, // Ctrl+T / Cmd+T
  closeTab: { targetKey: 'w', ctrlKey: true, metaKey: true }, // Ctrl+W / Cmd+W
  refresh: { targetKey: 'r', ctrlKey: true, metaKey: true }, // Ctrl+R / Cmd+R
  undo: { targetKey: 'z', ctrlKey: true, metaKey: true }, // Ctrl+Z / Cmd+Z
  redo: { targetKey: 'z', ctrlKey: true, shiftKey: true, metaKey: true }, // Ctrl+Shift+Z / Cmd+Shift+Z
};

// 全局搜索快捷键 Hook
export const useGlobalSearchShortcut = (onSearchOpen: () => void) => {
  return useKeyboardShortcut(onSearchOpen, commonShortcuts.search);
};