package audit

import "sync"

type Logger struct {
	mu   sync.Mutex
	logs []Log
}

func NewLogger() *Logger {
	return &Logger{logs: []Log{}}
}

func (l *Logger) Append(log Log) Log {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.logs = append([]Log{log}, l.logs...)
	return log
}

func (l *Logger) All() []Log {
	l.mu.Lock()
	defer l.mu.Unlock()
	return append([]Log(nil), l.logs...)
}
