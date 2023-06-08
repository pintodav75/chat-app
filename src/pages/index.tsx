import { useState, type ReactElement, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Logo from "../assets/lbc-logo.webp";
import styles from "../styles/Home.module.css";
import { User } from "../types/user";
import UserDetails from "../components/UserDetails";

const Home = (): ReactElement => {
  const year = new Date().getFullYear();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const fetchUsers = async () => {
    const response = await fetch(`http://localhost:3005/users`);
    const usersContent = await response.json();
    console.log("users:", usersContent);
    setUsers(usersContent);
  };

  useEffect(() => {
    async function fetchData() {
      await fetchUsers();
    }
    fetchData();
  }, []);

  function UsersList() {
    return (
      <>
        {users.map((user) => (
          <div key={user.id} onClick={() => setSelectedUser(user)}>
            {user.nickname}
          </div>
        ))}
      </>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Frontend Technical test - Leboncoin</title>
        <meta
          name="description"
          content="Frontend exercise for developpers who want to join us on leboncoin.fr"
        ></meta>
      </Head>
      <main className={styles.main}>
        <UsersList />
        {selectedUser && <UserDetails selectedUser={selectedUser} />}
      </main>

      <footer className={styles.footer}>&copy; leboncoin - {year}</footer>
    </div>
  );
};

export default Home;
