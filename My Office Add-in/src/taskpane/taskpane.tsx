/// <reference types="office-js" />

import React, { useEffect, useRef } from 'react';

interface RecordType {
  id: string;
  full_Name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  state_name: string;
  city: string;
  address: string;
}

interface MessageType {
  type: 'init' | 'insert' | 'update' | 'delete';
  data: any;
}

const TaskPane: React.FC = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const rowMapRef = useRef<Map<string, number>>(new Map());
  const messageQueueRef = useRef<MessageType[]>([]);
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false); // Prevent double init in React 18

  const recordToRow = (r: RecordType) => [
    r.id,
    r.full_Name,
    r.email,
    r.phone,
    r.gender,
    r.dob,
    r.state_name,
    r.city,
    r.address,
  ];

  // Process all queued messages in one Excel.run
  const processBatch = async () => {
    if (messageQueueRef.current.length === 0) return;

    const messages = [...messageQueueRef.current];
    messageQueueRef.current = [];

    try {
      await Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const usedRange = sheet.getUsedRange();
        usedRange.load('values, rowCount');
        await context.sync();

        // Rebuild row map if empty
        if (rowMapRef.current.size === 0 && usedRange.values.length > 1) {
          usedRange.values.slice(1).forEach((row: any[], idx: number) => {
            rowMapRef.current.set(row[0], idx + 2); // +2 for header
          });
        }

        const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Gender', 'DOB', 'State', 'City', 'Address'];

        for (const message of messages) {
          switch (message.type) {
            case 'init': {
              const totalRows = message.data.length + 1;
              sheet.getRange(`A1:I${totalRows}`).clear();
              const rows = [headers, ...message.data.map(recordToRow)];
              sheet.getRange(`A1:I${rows.length}`).values = rows;

              rowMapRef.current.clear();
              message.data.forEach((r: RecordType, idx: number) => {
                rowMapRef.current.set(r.id, idx + 2);
              });
              break;
            }

            case 'insert': {
              const newRecord: RecordType = message.data;
              const nextRow = usedRange.rowCount + 1;
              sheet.getRange(`A${nextRow}:I${nextRow}`).values = [recordToRow(newRecord)];
              rowMapRef.current.set(newRecord.id, nextRow);
              break;
            }

            case 'update': {
              const updatedRecord: RecordType = message.data;
              const rowIndex = rowMapRef.current.get(updatedRecord.id);
              if (rowIndex) {
                sheet.getRange(`A${rowIndex}:I${rowIndex}`).values = [recordToRow(updatedRecord)];
              }
              break;
            }

            case 'delete': {
              const deletedId = message.data.id;
              const rowIndex = rowMapRef.current.get(deletedId);
              if (rowIndex) {
                sheet.getRange(`${rowIndex}:${rowIndex}`).delete(Excel.DeleteShiftDirection.up);
                rowMapRef.current.delete(deletedId);

                // Update map for rows below deleted row
                rowMapRef.current.forEach((row, id) => {
                  if (row > rowIndex) rowMapRef.current.set(id, row - 1);
                });
              }
              break;
            }
          }
        }

        await context.sync();
      });
    } catch (error) {
      console.error('Excel.run error:', error);
    }
  };

  useEffect(() => {
    if (initializedRef.current) return; // Prevent double init
    initializedRef.current = true;

    const socket = new WebSocket('ws://localhost:3002'); // Use wss:// if HTTPS
    wsRef.current = socket;

    socket.onopen = () => console.log('Connected to WebSocket server');
    socket.onerror = (err) => console.error('WebSocket error:', err);
    socket.onclose = () => console.log('WebSocket connection closed');

    socket.onmessage = (event) => {
      try {
        const message: MessageType = JSON.parse(event.data);
        messageQueueRef.current.push(message);

        // Debounce batch updates to Excel every 100ms
        if (batchTimerRef.current) clearTimeout(batchTimerRef.current);
        batchTimerRef.current = setTimeout(() => processBatch(), 100);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    return () => {
      wsRef.current?.close();
      if (batchTimerRef.current) clearTimeout(batchTimerRef.current);
    };
  }, []);

  return (
    <div style={{ padding: '10px' }}>
      Excel Add-in Connected! Real-time updates optimized with batching.
    </div>
  );
};

export default TaskPane;
