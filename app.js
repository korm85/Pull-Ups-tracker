document.addEventListener('DOMContentLoaded', () => {
    let workoutPlan = loadWorkoutPlan() || generateWorkoutPlan(20);
    let currentWorkoutIndex = localStorage.getItem('currentWorkoutIndex')
        ? parseInt(localStorage.getItem('currentWorkoutIndex'), 10)
        : 0;

    displayWorkout(workoutPlan, currentWorkoutIndex);

    function generateWorkoutPlan(weeks) {
        const initialReps = 12;
        const sets = 10;
        let plan = [];

        for (let week = 1; week <= weeks; week++) {
            for (let workout = 1; workout <= 3; workout++) { // Assume 3 workouts per week
                let workoutPlan = { week: week, sets: [], date: null };
                for (let set = 1; set <= sets; set++) {
                    let reps = initialReps;
                    if (week > 1) {
                        let additionalReps = Math.floor((week - 2) / sets);
                        if ((week - 2) % sets >= set - 1) {
                            additionalReps += 1;
                        }
                        reps += additionalReps;
                    }
                    workoutPlan.sets.push({ set: set, reps: reps, completed: false });
                }
                plan.push(workoutPlan);
            }
        }
        return plan;
    }

    function loadWorkoutPlan() {
        const savedPlan = localStorage.getItem('workoutPlan');
        return savedPlan ? JSON.parse(savedPlan) : null;
    }

    function saveWorkoutPlan(plan, currentIndex) {
        localStorage.setItem('workoutPlan', JSON.stringify(plan));
        localStorage.setItem('currentWorkoutIndex', currentIndex);
    }

    function displayWorkout(workoutPlan, index) {
        const workout = workoutPlan[index];
        const workoutTracker = document.getElementById('workout-tracker');
        workoutTracker.innerHTML = '';

        const workoutDiv = document.createElement('div');
        workoutDiv.className = 'workout';
        workoutDiv.innerHTML = `
            <h2>Workout for Week ${workout.week}</h2>
            <h3>Date: ${workout.date || 'Not Completed Yet'}</h3>
        `;

        const table = document.createElement('table');
        table.className = 'min-w-full bg-white';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th class="py-2 px-4 border-b text-left">Set</th>
                <th class="py-2 px-4 border-b text-left">Reps</th>
                <th class="py-2 px-4 border-b text-center">Status</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        workout.sets.forEach(set => {
            const row = document.createElement('tr');
            row.className = 'border-b';
            row.innerHTML = `
                <td class="py-2 px-4 text-left">Set ${set.set}</td>
                <td class="py-2 px-4 text-left">${set.reps} reps</td>
                <td class="py-2 px-4 text-center"><button class="complete-button ${set.completed ? 'completed-button' : ''}" data-set="${set.set}">${set.completed ? 'Completed' : 'Complete'}</button></td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        workoutDiv.appendChild(table);
        workoutTracker.appendChild(workoutDiv);

        updateProgressBar(workoutPlan, index);

        const nextButton = document.getElementById('next-workout');
        const prevButton = document.getElementById('prev-workout');

        nextButton.classList.toggle('hidden', index >= workoutPlan.length - 1);
        prevButton.classList.toggle('hidden', index <= 0);
    }

    function updateWorkout(workoutPlan, index) {
        const workout = workoutPlan[index];
        const buttons = document.querySelectorAll('.complete-button');

        let totalReps = 0;
        buttons.forEach(button => {
            const setIndex = parseInt(button.getAttribute('data-set'), 10) - 1;
            workout.sets[setIndex].completed = button.classList.contains('completed-button');
            if (workout.sets[setIndex].completed) {
                totalReps += workout.sets[setIndex].reps;
            }
        });

        workout.date = new Date().toLocaleDateString(); // Mark the workout's date

        saveWorkoutPlan(workoutPlan, index);
        displayWorkout(workoutPlan, index);
    }

    function updateProgressBar(workoutPlan, index) {
        const workout = workoutPlan[index];
        const completedSets = workout.sets.filter(set => set.completed).length;
        const totalSets = workout.sets.length;
        const progressPercentage = (completedSets / totalSets) * 100;
        const progressBarFill = document.getElementById('progress-bar-fill');
        progressBarFill.style.width = `${progressPercentage}%`;
    }

    document.addEventListener('click', event => {
        if (event.target.classList.contains('complete-button')) {
            event.target.classList.toggle('completed-button');
            event.target.textContent = event.target.classList.contains('completed-button') ? 'Completed' : 'Complete';
            updateWorkout(workoutPlan, currentWorkoutIndex);
        }
    });

    document.getElementById('next-workout').addEventListener('click', () => {
        currentWorkoutIndex++;
        if (currentWorkoutIndex < workoutPlan.length) {
            displayWorkout(workoutPlan, currentWorkoutIndex);
        }
    });

    document.getElementById('prev-workout').addEventListener('click', () => {
        currentWorkoutIndex--;
        if (currentWorkoutIndex >= 0) {
            displayWorkout(workoutPlan, currentWorkoutIndex);
        }
    });

    document.getElementById('save-workout').addEventListener('click', () => {
        alert('Workout saved!');
    });
});