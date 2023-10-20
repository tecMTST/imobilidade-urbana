using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneLoader : MonoBehaviour
{
    public string sceneToLoad = "TrainScene";

    public void LoadScene()
    {
        Debug.Log("Di");
        SceneManager.LoadScene(sceneToLoad);
    }
}
