<script setup>
  import { reactive } from "vue";
  import { createToast } from "mosha-vue-toastify";
  import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

  import AppButton from "../components/AppButton.vue";
  import ScoreSelector from "../components/ScoreSelector.vue";
  import { firebaseApp } from "../firebase";
  import store from "../store";

  const db = getFirestore(firebaseApp);

  const judgeState = reactive({
    loading: false,
    team: "",
    teamData: null,
  });

  const teams = [
    "A1", "A2", "A3", "A4", "A5", "A7", "A8", "A9", "A10", "A11", "A12",
    "B1", "B2", "B3", "B4", "B5", "B7", "B8", "B9", "B10", "B11", "B12",
    "C1", "C2", "C3", "C4", "C5", "C7", "C8", "C9", "C10", "C11", "C12",
    "D1", "D2", "D3", "D4", "D5", "D7", "D8", "D9", "D10", "D11", "D12",
    "E1", "E2", "E3", "E4", "E5", "E7", "E8", "E9", "E10", "E11",
    "F1", "F2", "F3", "F4", "F5", "F7", "F8", "F9", "F10", "F11", "F12",
    "G1", "G2", "G3", "G4", "G5", "G7", "G8", "G9", "G10", "G11", "G12",
    "H1", "H2", "H3", "H4", "H5", "H7", "H8", "H9", "H10", "H11", "H12",
    "I1", "I2", "I3", "I4", "I5", "I7", "I8", "I9", "I10", "I11", "I12",
    "J1", "J2", "J3", "J4", "J5", "J7", "J8", "J9", "J10", "J11", "J12",
    "K2", "K3", "K4", "K5", "K7", "K8", "K9", "K10", "K11", "K12",
    "L1", "L2", "L3", "L4", "L5", "L7", "L8", "L9", "L10", "L11", "L12",
    "M1", "M2", "M3", "M4", "M5", "M7", "M8", "M9", "M10", "M11", "M12",
  ];

  const selectTeam = async () => {
    try {
      judgeState.loading = true;

      const docRef = doc(db, "teams", judgeState.team);
      const docSnap = await getDoc(docRef);      
      if (!docSnap.exists()) throw new Error(`Team ${judgeState.team} does not exist.`);

      let data = {
        team: judgeState.team,
        members: (docSnap.data()).members,
        q1: null,
        q2: null,
        q3: null,
        q4: null,
        comments: "",
      };

      // Get current judge's feedback
      const fbRef = doc(db, "teams", judgeState.team, "feedback", store.state.user.name);
      const fbSnap = await getDoc(fbRef);

      if (fbSnap.exists()) {
        data = { ...data, ...fbSnap.data() };
      }

      judgeState.teamData = data;
    } catch (err) {
      console.error("Error - judge.selectTeam", err);
      createToast("Error getting team data. Please try again shortly.", { type: "danger" });
    } finally {
      judgeState.loading = false;
    }
  };

  const submitFeedback = async () => {
    try {
      judgeState.loading = true;

      await setDoc(doc(db, "teams", judgeState.teamData.team, "feedback", store.state.user.name), judgeState.teamData);
      createToast(`Successfully submitted feedback for team ${judgeState.teamData.team}`, { type: "success" });
    } catch (err) {
      console.error("Error - judge.submitFeedback", err);
      createToast("Error submitting team feedback. Please try again shortly.", { type: "danger" });
    } finally {
      judgeState.loading = false;
    }
  };

  function updateQuestionValue (p, v) {
    judgeState.teamData[p] = v;
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
              <select v-model="judgeState.team" name="team" id="team" required class="w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500" :disabled="judgeState.loading">
                <option value="">Please select</option>
                <option v-for="t in teams" :value="t">{{ t }}</option>
              </select>
            </div>
          </div>
          <app-button
            :disabled="judgeState.loading"
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
    <div v-if="judgeState.teamData" class="px-4 sm:px-6 md:px-8 lg:px-10 py-6 bg-white shadow-md rounded-3xl md:col-span-8">
      <div class="mb-4 text-center">
        <h2 class="text-md font-medium">Team: {{ judgeState.teamData.team }}</h2>
        <p class="text-xs">{{ judgeState.teamData.members }}</p>
      </div>

      <form @submit.prevent="() => submitFeedback()" class="space-y-4">
        <score-selector
          property="q1"
          :value="judgeState.teamData.q1"
          prompt="Addressed the challenge"
          :fn="updateQuestionValue"
        >
          How might you use player performance data and other factors (player social media, club websites, hometown loyalty, etc.) to develop a predictive model of player value to drive attendance to FCC games?
        </score-selector>
        <score-selector
          property="q2"
          :value="judgeState.teamData.q2"
          prompt="Stated and supported a problem"
          :fn="updateQuestionValue"
        >
          Did the team provide a clear problem to address?<br />Did the team provide evidence to support and develop their problem?
        </score-selector>
        <score-selector
          property="q3"
          :value="judgeState.teamData.q3"
          prompt="Delivered a professional presentation"
          :fn="updateQuestionValue"
        >
          Did the team engage the audience?<br />Did the team deliver a professional presentation?<br />Did the team develop a compelling slide design?
        </score-selector>
        <score-selector
          property="q4"
          :value="judgeState.teamData.q4"
          prompt="Had a compelling model with clear factors"
          :fn="updateQuestionValue"
        >
          Did the team provide insights from research and data?<br />Is there a novelty aspect to the team's model?<br />Did the team address how the model and factors could potentially increase attendance (with supportive evidence)?<br />What is the likelihood that FC Cincinnati will find the proposed model and accompanying factors feasible?
        </score-selector>
        <div>
          <label for="comments" class="text-xs tracking-wide text-gray-600">Comments for the team</label>
          <textarea v-model="judgeState.teamData.comments" name="comments" id="comments" rows="6" class="w-full resize-none rounded-xl"></textarea>
        </div>
        <app-button
            :disabled="judgeState.loading"
          >
            <span class="mr-2 uppercase">Submit Feedback</span>
            <span>
              <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </app-button>
      </form>
    </div>
  </div>
</template>
