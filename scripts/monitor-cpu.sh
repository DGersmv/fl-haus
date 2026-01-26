#!/bin/bash
# Monitor suspicious CPU activity

THRESHOLD=80
LOG_FILE="/var/log/country-house-cpu.log"

CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 | cut -d'.' -f1)

if [ "$CPU_USAGE" -gt "$THRESHOLD" ]; then
    echo "$(date): HIGH CPU: ${CPU_USAGE}%" | tee -a "$LOG_FILE"

    echo "=== Top Processes ===" >> "$LOG_FILE"
    ps aux --sort=-%cpu | head -10 >> "$LOG_FILE"

    echo "=== Network Connections ===" >> "$LOG_FILE"
    netstat -tupln | grep node >> "$LOG_FILE"

    MINING_PORTS=$(netstat -tupln | grep -E '3333|5555|7777')
    if [ ! -z "$MINING_PORTS" ]; then
        echo "ALERT: Mining ports detected!" >> "$LOG_FILE"
        echo "$MINING_PORTS" >> "$LOG_FILE"
    fi

    echo "---" >> "$LOG_FILE"
fi
