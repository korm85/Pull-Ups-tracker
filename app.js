document.addEventListener('DOMContentLoaded', () => {
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
