<template>
  <q-calendar-agenda
    ref="calendar"
    class="agenda-size"
    v-model="selectedDate"
    view="week"
    :day-min-height="MIN_DAY_HEIGHT"
    bordered
    animated
    locale="pt-br"
  >
    <template #day="{ scope: { timestamp } }">
      <BadgeEventsInWeekSchedule :data="timestamp.date" :events="events" />
    </template>
  </q-calendar-agenda>
</template>

<script setup lang="ts">
import { QCalendarAgenda, today } from "@quasar/quasar-ui-qcalendar/";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarAgenda.sass";
import { MIN_DAY_HEIGHT } from "../../../support/constants";
import { createEvent, getHeadDay } from "../ScheduleRoom/lib";
import ScheduleRoomLoad from "../../../graphql/scheduleRoom/ScheduleRoomLoad.gql";
import { DateTime } from "luxon";
import { EventRoom } from "../../../entities/scheduleRoom";

const selectedDate = ref(today());
const events = ref();

async function loadSchedule() {
  const { scheduleRoomLoad } = (await runQuery(ScheduleRoomLoad)) as {
    scheduleRoomLoad: EventRoom[];
  };
  scheduleRoomLoad.forEach((event) => {
    const initialTime = DateTime.fromISO(event.initialTime.toString()).plus({
      hours: 3,
    });
    const finalTime = DateTime.fromISO(event.finalTime.toString()).plus({
      hours: 3,
    });

    event.initialTime = DateTime.fromISO(initialTime.toString());
    event.finalTime = DateTime.fromISO(finalTime.toString());
  });
  events.value = createEvent(scheduleRoomLoad);
}

onMounted(() => {
  loadSchedule();
});
</script>
<style scoped>
.custom-color {
  background-color: rgb(31, 73, 125);
}
.agenda-size {
  height: 40rem;
  max-height: 45rem;
  overflow-y: scroll;
}
</style>
