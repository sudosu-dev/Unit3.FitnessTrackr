import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useApi } from "../api/ApiContext";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";

export default function ActivitiesPage() {
  const {
    data: activities,
    loading,
    error,
  } = useQuery("/activities", "activities");

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!activities) return null;
  return (
    <>
      <h1>Activities</h1>
      <p>Imagine all the activities!</p>
      <section>
        <ul>
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </ul>
      </section>
      <AddActivityForm />
    </>
  );
}

function ActivityItem({ activity }) {
  const { token } = useAuth();
  const {
    mutate: deleteActivity,
    loading,
    error,
  } = useMutation("DELETE", "/activities/" + activity.id, ["activities"]);
  return (
    <li key={activity.id}>
      <span>{activity.name}</span>
      {token && (
        <button
          onClick={() => {
            console.log("Deleting:", activity.id);
            deleteActivity();
          }}
        >
          {loading ? "Deleting" : error ? error : "Delete"}
        </button>
      )}
    </li>
  );
}

function AddActivityForm({ activity }) {
  const { token } = useAuth();
  const {
    mutate: addActivity,
    loading,
    error,
  } = useMutation("POST", "/activities", ["activities"]);

  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addActivity(formData);
  };

  if (!token) return null;

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      <button>{loading ? "Adding" : error ? error : "Add Activity"}</button>
    </form>
  );
}
