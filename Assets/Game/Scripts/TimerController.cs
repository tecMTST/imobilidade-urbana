using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class TimerController : MonoBehaviour
{
    public float initialTime;
    public float penalty;
    
    private float currentTime;
    private string gameOverScene = "GameOverScene"; 
    
    // Start is called before the first frame update
    void Start()
    {
        DontDestroyOnLoad(gameObject);
        currentTime = initialTime;
    }

    // Update is called once per frame
    void Update()
    {
        if(currentTime > 1)
        {
            currentTime -= Time.deltaTime;
        }
        else
        {
            SceneManager.LoadScene(gameOverScene);
        }
    }

    public void Captured()
    {
        currentTime -= penalty;
    }

    public float GetCurrentTime()
    {
        return currentTime;
    }
}
