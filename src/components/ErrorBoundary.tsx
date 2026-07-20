import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  label?: string;
}
interface State {
  hasError: boolean;
  error?: string;
}

// Изолирует ошибку одной секции, чтобы не ронять весь сайт
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error) {
    // Выводим в консоль для отладки
    console.error('[ErrorBoundary]', this.props.label, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#d4af37', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          Ошибка в блоке: {this.props.label || 'секция'} — {this.state.error}
        </div>
      );
    }
    return this.props.children;
  }
}
