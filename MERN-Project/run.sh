#!/usr/bin/env bash
# ====================================================================
# FeedbackHub (MERN Stack) - Easy Startup & Control Script
# ====================================================================

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR" || exit 1

BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

BACKEND_PID_FILE="$APP_DIR/backend.pid"
FRONTEND_PID_FILE="$APP_DIR/frontend.pid"

BACKEND_LOG="$APP_DIR/backend.log"
FRONTEND_LOG="$APP_DIR/frontend.log"

BACKEND_PORT=5050
FRONTEND_PORT=5173

start_servers() {
    echo "=================================================================="
    echo "🚀 Launching FeedbackHub (MERN Stack) System..."
    echo "=================================================================="

    # 1. Check MongoDB
    if ! lsof -i :27017 >/dev/null 2>&1; then
        echo "⚠️  MongoDB does not appear to be running on port 27017."
        echo "   Attempting to start MongoDB via brew services..."
        brew services start mongodb-community >/dev/null 2>&1 || brew services start mongodb >/dev/null 2>&1
        sleep 2
    fi

    # 2. Start Backend
    if [ -f "$BACKEND_PID_FILE" ] && kill -0 "$(cat "$BACKEND_PID_FILE")" 2>/dev/null; then
        echo "⚠️  Backend is already running (PID: $(cat "$BACKEND_PID_FILE")) on port $BACKEND_PORT"
    else
        echo "📡 Starting Node.js + Express backend on port $BACKEND_PORT..."
        cd "$BACKEND_DIR" || exit 1
        nohup node server.js > "$BACKEND_LOG" 2>&1 &
        BACKEND_PID=$!
        echo $BACKEND_PID > "$BACKEND_PID_FILE"
        disown $BACKEND_PID 2>/dev/null
        cd "$APP_DIR" || exit 1
    fi

    # 3. Start Frontend
    if [ -f "$FRONTEND_PID_FILE" ] && kill -0 "$(cat "$FRONTEND_PID_FILE")" 2>/dev/null; then
        echo "⚠️  Frontend is already running (PID: $(cat "$FRONTEND_PID_FILE")) on port $FRONTEND_PORT"
    else
        echo "⚡ Starting React.js (Vite) frontend on port $FRONTEND_PORT..."
        cd "$FRONTEND_DIR" || exit 1
        nohup npx vite --port $FRONTEND_PORT --host 0.0.0.0 > "$FRONTEND_LOG" 2>&1 &
        FRONTEND_PID=$!
        echo $FRONTEND_PID > "$FRONTEND_PID_FILE"
        disown $FRONTEND_PID 2>/dev/null
        cd "$APP_DIR" || exit 1
    fi

    echo "⏳ Waiting for servers to initialize..."
    sleep 3

    echo ""
    echo "=================================================================="
    echo "✅ FeedbackHub MERN System is RUNNING!"
    echo "=================================================================="
    echo "🌐 Access Points:"
    echo "   • Web Application (React)  : http://localhost:$FRONTEND_PORT"
    echo "   • Student Portal Login     : http://localhost:$FRONTEND_PORT/login"
    echo "   • Admin Portal Login       : http://localhost:$FRONTEND_PORT/admin/login"
    echo "   • Backend REST API         : http://localhost:$BACKEND_PORT/api"
    echo ""
    echo "🔑 Pre-seeded Demo Credentials:"
    echo "   • Student : Roll No 'CS202601' | Password 'student123'"
    echo "   • Admin   : Username 'admin'    | Password 'admin123'"
    echo ""
    echo "📋 Logs:"
    echo "   • Backend  : tail -f $BACKEND_LOG"
    echo "   • Frontend : tail -f $FRONTEND_LOG"
    echo "=================================================================="
}

stop_servers() {
    echo "🛑 Stopping FeedbackHub services..."

    if [ -f "$BACKEND_PID_FILE" ]; then
        PID=$(cat "$BACKEND_PID_FILE")
        kill "$PID" 2>/dev/null
        rm -f "$BACKEND_PID_FILE"
        echo "   • Stopped backend process $PID"
    fi

    if [ -f "$FRONTEND_PID_FILE" ]; then
        PID=$(cat "$FRONTEND_PID_FILE")
        kill "$PID" 2>/dev/null
        rm -f "$FRONTEND_PID_FILE"
        echo "   • Stopped frontend process $PID"
    fi

    B_PORT_PID=$(lsof -ti :$BACKEND_PORT 2>/dev/null)
    if [ -n "$B_PORT_PID" ]; then
        kill -9 $B_PORT_PID 2>/dev/null
    fi

    F_PORT_PID=$(lsof -ti :$FRONTEND_PORT 2>/dev/null)
    if [ -n "$F_PORT_PID" ]; then
        kill -9 $F_PORT_PID 2>/dev/null
    fi

    echo "✅ All FeedbackHub services stopped."
}

status_servers() {
    echo "🔍 Checking FeedbackHub status..."

    B_PID=$(lsof -ti :$BACKEND_PORT 2>/dev/null)
    if [ -n "$B_PID" ]; then
        echo "   • Backend  (Node.js + Express) : ACTIVE on port $BACKEND_PORT (PID: $B_PID)"
    else
        echo "   • Backend  (Node.js + Express) : STOPPED"
    fi

    F_PID=$(lsof -ti :$FRONTEND_PORT 2>/dev/null)
    if [ -n "$F_PID" ]; then
        echo "   • Frontend (React.js + Vite)  : ACTIVE on port $FRONTEND_PORT (PID: $F_PID)"
    else
        echo "   • Frontend (React.js + Vite)  : STOPPED"
    fi
}

case "$1" in
    start)
        start_servers
        ;;
    stop)
        stop_servers
        ;;
    restart)
        stop_servers
        sleep 1
        start_servers
        ;;
    status)
        status_servers
        ;;
    *)
        echo "Usage: ./run.sh {start|stop|restart|status}"
        exit 1
        ;;
esac
