<script setup>
  import { ref } from "vue";
  import { createToast } from "mosha-vue-toastify";
  import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";

  import AppButton from "../components/AppButton.vue";
  import { firebaseApp } from "../firebase";

  const loading = ref(false);
  const team = ref("");
  const teamData = ref(null);

  const db = getFirestore(firebaseApp);

  const teams = [
    "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12",
    "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12",
    "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C10", "C11", "C12",
    "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11",
    "E1", "E2", "E3", "E4", "E5", "E7", "E8", "E9", "E10", "E11",
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F11", "F12",
    "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G11", "G12",
    "H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H11", "H12",
    "I1", "I2", "I3", "I4", "I5", "I7", "I8", "I9", "I10", "I11", "I12",
    "J1", "J2", "J3", "J4", "J5", "J7", "J8", "J9", "J10", "J11",
    "K1", "K2", "K3", "K4", "K5", "K6", "K7", "K8", "K9", "K10", "K11", "K12",
    "Eschwab", "FPinchot", "FSixu", "FTracey", "HBishen",
  ];

  const selectTeam = async () => {
    try {
      loading.value = true;

      const docRef = doc(db, "teams", team.value);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) throw new Error(`Team ${team.value} does not exist.`);

      let data = {
        team: team.value,
        members: (docSnap.data()).members,
        feedback: [],
      };
      const subColRef = collection(db, "teams", team.value, "feedback");
      const qSnap = await getDocs(subColRef);
      data.feedback = qSnap.docs.map(d => ({ judge: d.id, ...d.data() }));
      teamData.value = data;
    } catch (err) {
      console.error("Error - faculty.selectTeam", err);
      createToast("Error getting team data. Please try again shortly.", { type: "danger" });
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div class="h-fit w-full grid md:grid-cols-12 gap-4">
    <div class="md:col-span-4">
      <div class="px-4 sm:px-6 md:px-8 lg:px-10 py-6 w-full flex flex-col bg-white shadow-md rounded-3xl">
        <form @submit.prevent="selectTeam" class="space-y-3">
          <div>
            <label for="team" class="block text-sm font-medium text-gray-700">Team</label>
            <div class="mt-1">
              <select v-model="team" name="team" id="team" required class="w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500" :disabled="loading">
                <option value="">Please select</option>
                <option v-for="t in teams" :value="t">{{ t }}</option>
              </select>
            </div>
          </div>
          <app-button
            :disabled="loading"
          >
            <span class="mr-2 uppercase">Select Team</span>
            <span>
              <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </app-button>
        </form>
      </div>
    </div>
    <div v-if="!loading && teamData && teamData.feedback.length > 0" class="px-4 sm:px-6 md:px-8 lg:px-10 py-6 bg-white shadow-md rounded-3xl md:col-span-8">
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
            <td class="py-1 px-2 font-medium border-r">Stated and supported a problem</td>
            <td class="text-center" v-for="fb in teamData.feedback">{{ fb.q2 }}</td>
          </tr>
          <tr class="border-b">
            <td class="py-1 px-2 font-medium border-r">Delivered a professional presentation</td>
            <td class="text-center" v-for="fb in teamData.feedback">{{ fb.q3 }}</td>
          </tr>
          <tr class="border-b">
            <td class="py-1 px-2 font-medium border-r">Had a compelling model with clear factors</td>
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
    <div v-else-if="!loading && teamData" class="px-4 sm:px-6 md:px-8 lg:px-10 py-6 bg-white shadow-md rounded-3xl md:col-span-8 flex justify-center items-center">
      <h2 class="text-3xl text-center">👀 Nothing here yet for team {{ teamData.team }}</h2>
    </div>
  </div>
</template>
