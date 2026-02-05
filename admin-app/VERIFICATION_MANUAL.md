# Manual Verification Script

Use this checklist to ensure the system is working correctly in the production environment.

## 1. Dashboard Loading
- [ ] Visit the homepage (`/`).
- [ ] Ensure "Coming Reservations" shows a number (or 0).
- [ ] Ensure the "Recent Reservations" list loads or shows "No reservations".

## 2. Event Creation & Form Generation
1.  Navigate to **Events** (`/events`).
2.  Click **Create New Event**.
3.  Enter Title: `Test Event`, Date: `Next Monday`, Details: `Test`.
4.  Click **Create**.
5.  **Verify**:
    - [ ] Alert says "Event created successfully".
    - [ ] A new row appears in the "Events" Google Sheet.
    - [ ] A new Google Form is created (Link in Sheet).

## 3. Reservation Sync
1.  As a user, fill out the "Normal Reservation Form" (Google Form).
2.  Wait 1-2 minutes (Next.js revalidation is set to 60s).
3.  Refresh **Reservations** page (`/reservations`).
4.  **Verify**:
    - [ ] New reservation appears in the list.

## 4. Status Update
1.  Click on the reservation in the list.
2.  Change Status to `Completed`.
3.  Click **Save Changes**.
4.  **Verify**:
    - [ ] Status updates in the list.
    - [ ] Status updates in the "Reservations" Google Sheet (Column H).

## 5. Change Request Workflow
1.  Manually add a row to the "Change Requests" Google Sheet (Simulating a form submission).
    - Status: `Pending`
2.  Navigate to **Change Requests** (`/changes`).
3.  **Verify**:
    - [ ] The card appears with Old vs New details.
4.  Click **Approve**.
5.  **Verify**:
    - [ ] Card disappears (or shows Approved).
    - [ ] "Change Requests" sheet status becomes `Approved`.
    - [ ] "Reservations" sheet/list updates with the *New* Date/Time/Count.

## 6. Form Option Sync
1.  Navigate to **Settings** (`/settings`).
2.  Click **Run Sync Now**.
3.  **Verify**:
    - [ ] Success message appears.
    - [ ] Check the real "Normal Reservation Form".
    - [ ] Dropdown options should lists the next ~8 Mondays, *excluding* the date you used for "Test Event".

## 7. Opinion Box
1.  Manually add a row to "Opinion Box" Sheet.
2.  Navigate to **Opinions** (`/opinions`).
3.  **Verify**:
    - [ ] The opinion appears in the list.
