'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Play, Database, Calendar, Network } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    id: '',
    name: '',
    duration: '',
    dependencies: []
  });
  const [dependencyInput, setDependencyInput] = useState('');

  const sampleData = [
    { id: 'A', name: 'Choix de la cible', duration: 4, dependencies: [] },
    { id: 'B', name: 'Mise en place des axes d\'argumentation', duration: 2, dependencies: ['A'] },
    { id: 'C', name: 'Conception du mailing', duration: 8, dependencies: ['B'] },
    { id: 'D', name: 'Impression du mailing', duration: 4, dependencies: ['C'] },
    { id: 'E', name: 'Conception de l\'argumentaire de relance', duration: 6, dependencies: ['B'] },
    { id: 'F', name: 'Location des fichiers', duration: 10, dependencies: ['A'] },
    { id: 'G', name: 'Envoi des mails', duration: 7, dependencies: ['D', 'F'] },
    { id: 'H', name: 'Recrutement des téléacteurs', duration: 13, dependencies: ['A'] },
    { id: 'I', name: 'Formation des téléacteurs', duration: 2, dependencies: ['H'] }
  ];

  const addTask = () => {
    if (newTask.id && newTask.name && newTask.duration) {
      // Vérifier que l'ID n'existe pas déjà
      if (tasks.find(task => task.id === newTask.id)) {
        alert('Une tâche avec cet ID existe déjà.');
        return;
      }

      setTasks([...tasks, {
        ...newTask,
        duration: parseInt(newTask.duration),
        dependencies: newTask.dependencies
      }]);

      // Réinitialiser le formulaire
      setNewTask({ id: '', name: '', duration: '', dependencies: [] });
      setDependencyInput('');
    }
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const loadSampleData = () => {
    setTasks(sampleData);
  };

  const clearData = () => {
    setTasks([]);
    setNewTask({ id: '', name: '', duration: '', dependencies: [] });
    setDependencyInput('');
  };

  const generateDiagram = (type) => {
    if (tasks.length === 0) {
      alert('Veuillez ajouter au moins une tâche pour générer le diagramme.');
      return;
    }

    // Valider les dépendances avant de générer
    const invalidDependencies = [];
    tasks.forEach(task => {
      task.dependencies.forEach(dep => {
        if (!tasks.find(t => t.id === dep)) {
          invalidDependencies.push(`Tâche ${task.id}: dépendance "${dep}" introuvable`);
        }
      });
    });

    if (invalidDependencies.length > 0) {
      alert('Erreurs dans les dépendances:\n' + invalidDependencies.join('\n'));
      return;
    }

    const queryParams = new URLSearchParams({
      data: JSON.stringify(tasks)
    });

    router.push(`/${type}?${queryParams.toString()}`);
  };

  const handleDependencyChange = (value) => {
    setDependencyInput(value);

    // Parser les dépendances : séparer par virgules, espaces ou points-virgules
    const deps = value
      .split(/[,;\s]+/) // Séparer par virgules, points-virgules ou espaces
      .map(dep => dep.trim().toUpperCase()) // Nettoyer et mettre en majuscules
      .filter(dep => dep !== '' && dep.length > 0); // Supprimer les entrées vides

    setNewTask(prev => ({ ...prev, dependencies: deps }));
  };

  const getAvailableDependencies = () => {
    return tasks.map(task => task.id).filter(id => id !== newTask.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Générateur de Diagrammes
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Créez facilement vos diagrammes de Gantt et PERT
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Diagramme de Gantt</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
              <Network className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Diagramme PERT</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Section d'ajout de tâches */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Ajouter une tâche
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID de la tâche
                    </label>
                    <input
                      type="text"
                      value={newTask.id}
                      onChange={(e) => setNewTask(prev => ({ ...prev, id: e.target.value.toUpperCase() }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="A, B, C..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durée (jours)
                    </label>
                    <input
                      type="number"
                      value={newTask.duration}
                      onChange={(e) => setNewTask(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la tâche
                  </label>
                  <input
                    type="text"
                    value={newTask.name}
                    onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description de la tâche"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dépendances
                  </label>
                  <input
                    type="text"
                    value={dependencyInput}
                    onChange={(e) => handleDependencyChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="A, B, C ou A B C ou A;B;C"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    {getAvailableDependencies().length > 0 ? (
                      <p>
                        <span className="font-medium">Tâches disponibles :</span> {getAvailableDependencies().join(', ')}
                      </p>
                    ) : (
                      <p>Ajoutez d&apos;abord des tâches pour créer des dépendances</p>
                    )}
                  </div>
                  {newTask.dependencies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-sm text-gray-600">Dépendances sélectionnées :</span>
                      {newTask.dependencies.map((dep, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            getAvailableDependencies().includes(dep)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {dep}
                          {!getAvailableDependencies().includes(dep) && ' ⚠️'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={addTask}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter la tâche
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={loadSampleData}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Database className="w-4 h-4" />
                    Données test
                  </button>
                  <button
                    onClick={clearData}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Effacer tout
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des tâches */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Tâches ajoutées ({tasks.length})
              </h2>

              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune tâche ajoutée pour le moment</p>
                  <p className="text-sm">Ajoutez des tâches ou chargez les données de test</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tasks.map((task, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
                              {task.id}
                            </span>
                            <h3 className="font-medium text-gray-800">{task.name}</h3>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">Durée:</span> {task.duration} jours</p>
                            {task.dependencies.length > 0 && (
                              <p>
                                <span className="font-medium">Dépendances:</span> {task.dependencies.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeTask(task.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Boutons de génération */}
          {tasks.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Générer les diagrammes
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => generateDiagram('gantt')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center justify-center gap-3 font-medium text-lg shadow-lg"
                >
                  <Calendar className="w-6 h-6" />
                  Diagramme de Gantt
                </button>
                <button
                  onClick={() => generateDiagram('pert')}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 flex items-center justify-center gap-3 font-medium text-lg shadow-lg"
                >
                  <Network className="w-6 h-6" />
                  Diagramme PERT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}