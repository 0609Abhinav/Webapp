import React, { useEffect } from 'react';
import * as Excel from '@microsoft/office-js';


const TaskPane: React.FC = () => {
  useEffect(() => {
    // Connect to backend WebSocket
    const socket = new WebSocket('ws://localhost:3002');

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      try {
        await Excel.run(async (context: Excel.RequestContext) => {
          const sheet = context.workbook.worksheets.getActiveWorksheet();

          // Load used range every time for accurate row count
          const usedRange = sheet.getUsedRange();
          usedRange.load('values, rowCount');
          await context.sync();

          const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Gender', 'DOB', 'State', 'City', 'Address'];

          switch (message.type) {
            case 'init':
              // Clear sheet first
              sheet.getRange('A1:I1000').clear();
              // Insert headers + data
              sheet.getRange('A1').values = [
                headers,
                ...message.data.map((r: any) => [
                  r.id,
                  r.full_Name,
                  r.email,
                  r.phone,
                  r.gender,
                  r.dob,
                  r.state_name,
                  r.city,
                  r.address,
                ]),
              ];
              break;

            case 'insert':
              const newRecord = message.data;
              const currentRange = sheet.getUsedRange();
              currentRange.load('rowCount');
              await context.sync();

              const newRow = currentRange.rowCount + 1; // 1-based Excel row
              sheet.getRange(`A${newRow}:I${newRow}`).values = [[
                newRecord.id,
                newRecord.full_Name,
                newRecord.email,
                newRecord.phone,
                newRecord.gender,
                newRecord.dob,
                newRecord.state_name,
                newRecord.city,
                newRecord.address,
              ]];
              break;

            case 'update':
              const updatedRecord = message.data;
              const updateRange = sheet.getUsedRange();
              updateRange.load('values');
              await context.sync();

              // Find row index of the record by ID
              const updateIndex = updateRange.values.findIndex((row: any) => row[0] === updatedRecord.id);
              if (updateIndex > -1) {
                sheet.getRange(`A${updateIndex + 1}:I${updateIndex + 1}`).values = [[
                  updatedRecord.id,
                  updatedRecord.full_Name,
                  updatedRecord.email,
                  updatedRecord.phone,
                  updatedRecord.gender,
                  updatedRecord.dob,
                  updatedRecord.state_name,
                  updatedRecord.city,
                  updatedRecord.address,
                ]];
              }
              break;

            case 'delete':
              const deletedId = message.data.id;
              const deleteRange = sheet.getUsedRange();
              deleteRange.load('values');
              await context.sync();

              const deleteIndex = deleteRange.values.findIndex((row: any) => row[0] === deletedId);
              if (deleteIndex > -1) {
                sheet.getRange(`${deleteIndex + 1}:${deleteIndex + 1}`).delete(Excel.DeleteShiftDirection.up);
              }
              break;

            default:
              console.warn('Unknown message type:', message.type);
          }

          await context.sync();
        });
      } catch (error) {
        console.error('Excel.run error:', error);
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup
    return () => socket.close();
  }, []);

  return <div style={{ padding: '10px' }}>Excel Add-in Connected! Records update in real-time.</div>;
};

export default TaskPane;
