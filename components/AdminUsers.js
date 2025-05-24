// components/AdminUsers.js
export default function AdminUsers() {
  return (
    <section id="manage-users">
      <h2>Manage Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Registered</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan="6">No users available</td></tr>
        </tbody>
      </table>
    </section>
  );
}