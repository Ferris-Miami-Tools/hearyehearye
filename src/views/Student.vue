<script setup>
  import { onMounted, ref } from "vue";
  import { createToast } from "mosha-vue-toastify";
  import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";

  import { firebaseApp } from "../firebase";
  import store from "../store";

  const loading = ref(true);
  const teamData = ref(null);

  const db = getFirestore(firebaseApp);

  const getTeamData = async () => {
    try {
      loading.value = true;

      const docRef = doc(db, "teams", store.state.user.team);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) throw new Error(`Team ${store.state.user.team} does not exist.`);

      let data = {
        team: store.state.user.team,
        members: (docSnap.data()).members,
        feedback: [],
      };
      const subColRef = collection(db, "teams", store.state.user.team, "feedback");
      const qSnap = await getDocs(subColRef);
      data.feedback = qSnap.docs.map(d => ({ judge: d.id, ...d.data() }));
      teamData.value = data;
    } catch (err) {
      console.error("Error - student.getTeamData", err);
      createToast("Error getting team data. Please try again shortly.", { type: "danger" });
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    await getTeamData();
  });
</script>

<template>
  <div v-if="!loading && teamData && teamData.feedback.length > 0" class="px-4 sm:px-6 md:px-8 lg:px-10 py-6 h-fit w-full bg-white shadow-md rounded-3xl md:col-span-8">
    <div class="mb-4 text-center">
      <h2 class="text-md font-medium">Team: {{ teamData.team }}</h2>
      <p class="text-xs">{{ teamData.members }}</p>
    </div>

    <table class="mb-4 table-auto text-xs sm:text-sm md:text-md">
      <thead class="border-b">
        <tr>
          <td></td>
          <td class="px-2 font-medium" v-for="fb in teamData.feedback">{{ fb.judge }}</td>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b">
          <td class="py-1 px-2 font-medium border-r">Addressed the challenge</td>
          <td class="text-center" v-for="fb in teamData.feedback">{{ fb.q1 }}</td>
        </tr>
        <tr class="border-b">
          <td class="py-1 px-2 font-medium border-r">Developed a Compelling Argument</td>
          <td class="text-center" v-for="fb in teamData.feedback">{{ fb.q2 }}</td>
        </tr>
        <tr class="border-b">
          <td class="py-1 px-2 font-medium border-r">Delivered a Professional Presentation</td>
          <td class="text-center" v-for="fb in teamData.feedback">{{ fb.q3 }}</td>
        </tr>
        <tr class="border-b">
          <td class="py-1 px-2 font-medium border-r">Compelling Solution / Idea</td>
          <td class="text-center" v-for="fb in teamData.feedback">{{ fb.q4 }}</td>
        </tr>
      </tbody>
    </table>

    <hr class="my-2 mx-auto w-8/12">
    <div class="w-full">
      <h2 class="mb-2 text-xl">Comments</h2>
      <div v-for="fb in teamData.feedback" class="mb-4">
        <blockquote v-if="fb.comments != ''" class="p-4 relative text-md italic border-l-4 bg-neutral-100 text-neutral-600 border-neutral-500 quote">
          <p class="mb-4">{{ fb.comments }}</p>
          <cite class="flex items-center">
            <div class="flex flex-col items-start">
              <span class="mb-1 text-sm italic font-bold">{{ fb.judge }}</span>
            </div>
          </cite>
        </blockquote>
      </div>
    </div>
  </div>
  <div v-else-if="!loading && teamData" class="flex-1 w-full flex justify-center items-center">
    <div class="px-4 sm:px-6 md:px-8 lg:px-10 py-6 h-fit w-full max-w-sm bg-white shadow-md rounded-3xl md:col-span-8 flex flex-col justify-center items-center">
      <h2 class="text-3xl text-center">👀 Nothing here yet for team {{ teamData.team }}</h2>
      <p class="text-sm">Check back after your presentation</p>
    </div>
  </div>
</template>