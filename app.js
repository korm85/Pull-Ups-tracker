document.addEventListener('DOMContentLoaded', () => {
    const workoutPlan = generateWorkoutPlan(20);
    let currentWeekIndex = 0;

    if (localStorage.getItem('workoutPlan') && localStorage.getItem('currentWeekIndex')) {
        const savedPlan = JSON.parse(localStorage.getItem('workoutPlan'));
        currentWeekIndex = parseInt(localStorage.getItem('currentWeekIndex'), 10);
        displayWorkoutPlan(savedPlan, currentWeekIndex);
    } else {
        displayWorkoutPlan(workoutPlan, currentWeekIndex);
    }

    function generateWorkoutPlan(weeks) {
        const initialReps = 12;
        const sets = 10;
        let plan = [];

        for (let week = 1; week <= weeks; week++) {
            let weekPlan = { week: week, sets: [] };
            for (let set = 1; set <= sets; set++) {
                let reps = initialReps;
                if (week > 1) {
                    let additionalReps = Math.floor((week - 2) / sets);
                    if ((week - 2) % sets >= set - 1) {
                        additionalReps += 1;
                    }
                    reps += additionalReps;
                }
                weekPlan.sets.push({ set: set, reps: reps, completed: false });
            }
            plan.push(weekPlan);
        }
        return plan;
    }

    function displayWorkoutPlan(workoutPlan, currentWeekIndex) {
        const workoutTracker = document.getElementById('workout-tracker');
        workoutTracker.innerHTML = '';

        const weekPlan = workoutPlan[currentWeekIndex];
        const weekDiv = document.createElement('div');
        weekDiv.className = 'week';
        weekDiv.innerHTML = `<h2>Week ${weekPlan.week}</h2>`;

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
        weekPlan.sets.forEach(set => {
            const row = document.createElement('tr');
            row.className = 'border-b';
            row.innerHTML = `
                <td class="py-2 px-4 text-left">Set ${set.set}</td>
                <td class="py-2 px-4 text-left">${set.reps} reps</td>
                <td class="py-2 px-4 text-center"><button class="complete-button ${set.completed ? 'completed' : ''}" data-set="${set.set}">${set.completed ? 'Completed' : 'Complete'}</button></td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        weekDiv.appendChild(table);
        workoutTracker.appendChild(weekDiv);

        updateProgressBar(workoutPlan, currentWeekIndex);
        document.getElementById('total-reps').textContent = '0';
    }

    function updateWorkoutPlan(workoutPlan, currentWeekIndex) {
        const weekPlan = workoutPlan[currentWeekIndex];
        const buttons = document.querySelectorAll('.complete-button');
        let totalReps = 0;

        buttons.forEach(button => {
            const setIndex = parseInt(button.getAttribute('data-set'), 10) - 1;
            weekPlan.sets[setIndex].completed = button.classList.contains('completed');
            if (button.classList.contains('completed')) {
                totalReps += weekPlan.sets[setIndex].reps;
            }
        });

        const allCompleted = weekPlan.sets.every(set => set.completed);
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

        updateProgressBar(workoutPlan, currentWeekIndex);
    }

    function updateProgressBar(workoutPlan, currentWeekIndex) {
        const weekPlan = workoutPlan[currentWeekIndex];
        const completedSets = weekPlan.sets.filter(set => set.completed).length;
        const totalSets = weekPlan.sets.length;
        const progressPercentage = (completedSets / totalSets) * 100;
        const progressBarFill = document.getElementById('progress-bar-fill');
        progressBarFill.style.width = `${progressPercentage}%`;
        progressBarFill.style.backgroundColor = `rgb(${255 - Math.round(255 * (progressPercentage / 100))}, 255, ${255 - Math.round(255 * (progressPercentage / 100))})`;
    }

    document.addEventListener('click', event => {
        if (event.target.classList.contains('complete-button')) {
            event.target.classList.toggle('completed');
            event.target.textContent = event.target.classList.contains('completed') ? 'Completed' : 'Complete';
            updateWorkoutPlan(workoutPlan, currentWeekIndex);
        }
    });

    document.getElementById('next-workout').addEventListener('click', () => {
        currentWeekIndex++;
        if (currentWeekIndex < workoutPlan.length) {
            displayWorkoutPlan(workoutPlan, currentWeekIndex);
            localStorage.setItem('currentWeekIndex', currentWeekIndex); // Save the new week index
        } else {
            alert('Congratulations! You have completed all workouts.');
        }
    });

    document.getElementById('prev-workout').addEventListener('click', () => {
        currentWeekIndex--;
        if (currentWeekIndex >= 0) {
            displayWorkoutPlan(workoutPlan, currentWeekIndex);
            localStorage.setItem('currentWeekIndex', currentWeekIndex); // Save the new week index
        } else {
            currentWeekIndex = 0;
            displayWorkoutPlan(workoutPlan, currentWeekIndex);
            localStorage.setItem('currentWeekIndex', currentWeekIndex); // Save the new week index
        }
    });

    document.getElementById('save-workout').addEventListener('click', () => {
        updateWorkoutPlan(workoutPlan, currentWeekIndex);
        alert('Workout plan saved!');
    });

    const buttons = document.querySelectorAll('.nav-button');
    const sections = document.querySelectorAll('.section');

    buttons.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            const targetId = event.target.getAttribute('id').replace('-button', '');
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // Initialize the dashboard section as visible
    document.getElementById('dashboard').classList.remove('hidden');
});
