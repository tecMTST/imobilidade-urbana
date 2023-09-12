using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneLoader : MonoBehaviour
{
    public string sceneToLoad = "SampleScene";

    public void LoadScene()
    {
        Debug.Log("Di");
        SceneManager.LoadScene(sceneToLoad);
    }
}
