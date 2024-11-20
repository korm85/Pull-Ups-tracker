document.addEventListener('DOMContentLoaded', () => {
    const totalWorkoutsPerWeek = 3; // Define how many workouts per week
    const workoutPlan = generateWorkoutPlan(20, totalWorkoutsPerWeek);
    let currentWeekIndex = 0;
    let currentWorkoutIndex = 0;

    if (localStorage.getItem('workoutPlan') && localStorage.getItem('currentWeekIndex') && localStorage.getItem('currentWorkoutIndex')) {
        const savedPlan = JSON.parse(localStorage.getItem('workoutPlan'));
        currentWeekIndex = parseInt(localStorage.getItem('currentWeekIndex'), 10);
        currentWorkoutIndex = parseInt(localStorage.getItem('currentWorkoutIndex'), 10);
        displayWorkoutPlan(savedPlan, currentWeekIndex, currentWorkoutIndex);
    } else {
        displayWorkoutPlan(workoutPlan, currentWeekIndex, currentWorkoutIndex);
    }

    function generateWorkoutPlan(weeks, workoutsPerWeek) {
        const initialReps = 12;
        const sets = 10;
        let plan = [];

        for (let week = 1; week <= weeks; week++) {
            let weekPlan = { week: week, workouts: [] };

            for (let workout = 1; workout <= workoutsPerWeek; workout++) {
                let workoutPlan = { workout: workout, sets: [] };
                for (let set = 1; set <= sets; set++) {
                    let reps = initialReps + (week - 1); // Increase reps weekly
                    workoutPlan.sets.push({ set: set, reps: reps, completed: false });
                }
                weekPlan.workouts.push(workoutPlan);
            }
            plan.push(weekPlan);
        }
        return plan;
    }

    function displayWorkoutPlan(workoutPlan, currentWeekIndex, currentWorkoutIndex) {
        const workoutTracker = document.getElementById('workout-tracker');
        workoutTracker.innerHTML = '';

        const weekPlan = workoutPlan[currentWeekIndex];
        const workoutPlanInWeek = weekPlan.workouts[currentWorkoutIndex];

        const weekDiv = document.createElement('div');
        weekDiv.className = 'week';
        weekDiv.innerHTML = `<h2>Week ${weekPlan.week} - Workout ${workoutPlanInWeek.workout}</h2>`;

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
        workoutPlanInWeek.sets.forEach(set => {
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

        weekDiv.appendChild(table);
        workoutTracker.appendChild(weekDiv);

        updateProgressBar(workoutPlan, currentWeekIndex, currentWorkoutIndex);
        document.getElementById('total-reps').textContent = '0';
    }

    function updateWorkoutPlan(workoutPlan, currentWeekIndex, currentWorkoutIndex) {
        const workoutPlanInWeek = workoutPlan[currentWeekIndex].workouts[currentWorkoutIndex];
        const buttons = document.querySelectorAll('.complete-button');
        let totalReps = 0;

        buttons.forEach(button => {
            const setIndex = parseInt(button.getAttribute('data-set'), 10) - 1;
            workoutPlanInWeek.sets[setIndex].completed = button.classList.contains('completed-button');
            if (button.classList.contains('completed-button')) {
                totalReps += workoutPlanInWeek.sets[setIndex].reps;
            }
        });

        const allCompleted = workoutPlanInWeek.sets.every(set => set.completed);
        const nextButton = document.getElementById('next-workout');
        if (allCompleted) {
            nextButton.classList.remove('hidden');
        } else {
            nextButton.classList.add('hidden');
        }

        document.getElementById('total-reps').textContent = totalReps;

        // Save progress to local storage
        localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
        localStorage.setItem('currentWeekIndex', currentWeekIndex);
        localStorage.setItem('currentWorkoutIndex', currentWorkoutIndex);

        updateProgressBar(workoutPlan, currentWeekIndex, currentWorkoutIndex);
    }

    function updateProgressBar(workoutPlan, currentWeekIndex, currentWorkoutIndex) {
        const workoutPlanInWeek = workoutPlan[currentWeekIndex].workouts[currentWorkoutIndex];
        const completedSets = workoutPlanInWeek.sets.filter(set => set.completed).length;
        const totalSets = workoutPlanInWeek.sets.length;
        const progressPercentage = (completedSets / totalSets) * 100;
        const progressBarFill = document.getElementById('progress-bar-fill');
        progressBarFill.style.width = `${progressPercentage}%`;
        progressBarFill.style.backgroundColor = `rgb(${255 - Math.round(255 * (progressPercentage / 100))}, 255, ${255 - Math.round(255 * (progressPercentage / 100))})`;
    }

    document.addEventListener('click', event => {
        if (event.target.classList.contains('complete-button')) {
            event.target.classList.toggle('completed-button');
            event.target.textContent = event.target.classList.contains('completed-button') ? 'Completed' : 'Complete';
            updateWorkoutPlan(workoutPlan, currentWeekIndex, currentWorkoutIndex);
        }
    });

    document.getElementById('next-workout').addEventListener('click', () => {
        currentWorkoutIndex++;
        if (currentWorkoutIndex >= totalWorkoutsPerWeek) {
            currentWorkoutIndex = 0;
            currentWeekIndex++;
        }
        if (currentWeekIndex < workoutPlan.length) {
            displayWorkoutPlan(workoutPlan, currentWeekIndex, currentWorkoutIndex);
            localStorage.setItem('currentWeekIndex', currentWeekIndex);
            localStorage.setItem('currentWorkoutIndex', currentWorkoutIndex);
        } else {
            alert('Congratulations! You have completed all workouts.');
        }
    });

    document.getElementById('prev-workout').addEventListener('click', () => {
        currentWorkoutIndex--;
        if (currentWorkoutIndex < 0) {
            currentWorkoutIndex = totalWorkoutsPerWeek - 1;
            currentWeekIndex--;
        }
        if (currentWeekIndex >= 0) {
            displayWorkoutPlan(workoutPlan, currentWeekIndex, currentWorkoutIndex);
            localStorage.setItem('currentWeekIndex', currentWeekIndex);
            localStorage.setItem('currentWorkoutIndex', currentWorkoutIndex);
        } else {
            currentWorkoutIndex = 0;
            currentWeekIndex = 0;
            displayWorkoutPlan(workoutPlan, currentWeekIndex, currentWorkoutIndex);
        }
    });

    document.getElementById('save-workout').addEventListener('click', () => {
        updateWorkoutPlan(workoutPlan, currentWeekIndex, currentWorkoutIndex);
        alert('Workout plan saved!');
    });

    // Initialize the dashboard section as visible
    document.getElementById('dashboard').classList.remove('hidden');
});