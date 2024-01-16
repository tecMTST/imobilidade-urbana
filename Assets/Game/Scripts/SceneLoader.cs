using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneLoader : MonoBehaviour
{

    public static SceneLoader Instance;

    
    
    public string sceneToLoad = "TrainScene";
    AsyncOperation operation;

    public bool LoadAsyncOnStart;


    private void Start() {

        if (LoadAsyncOnStart)
            LoadSceneAsync(sceneToLoad);


    }

    public void LoadScene(){
        //Debug.Log("Di");
        SceneManager.LoadScene(sceneToLoad);
    }

    public void LoadSceneAsync(string scene) {
        operation = SceneManager.LoadSceneAsync(scene);
        operation.allowSceneActivation = false;

    }

    public void AllowSceneActivation(bool allow) {
        operation.allowSceneActivation = allow;
    }

    public void LoadScene(string scene) {
        //Debug.Log("Di");
        SceneManager.LoadScene(scene);
    }
}



